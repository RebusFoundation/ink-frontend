<script>
  // your script goes here
  import DOMPurify from "dompurify";
  import LabelMenu from '../components/LabelMenu.svelte'
  import { decode, encode } from "universal-base64url";
  import { update } from "../api/update.js";
  import TextButton from "../components/TextButton.svelte";
  import {afterUpdate, tick} from 'svelte';
  import { stores } from "../stores";
  const {notesEditor} = stores();
  const purifyConfig = {
    KEEP_CONTENT: false,
    FORBID_TAGS: ["style", "link"],
    FORBID_ATTR: ["style"]
  };
  export let note;
  export let current;
  export let collection;
  export let modal;
  let highlight;
  let comment;
  let commented;
  $: highlight = DOMPurify.sanitize(note.content, purifyConfig);
  comment = "";
  commented = false;
  $: if (note.json.comment) {
    comment = DOMPurify.sanitize(note.json.comment, purifyConfig);
    commented = true
  }
  let selected;
  $: if (current === note.id) {
    selected = true;
  }
  let commentElement
  function handlePaste (event) {
    event.stopPropagation();
    event.preventDefault();
    const clipboardData = event.clipboardData || window.clipboardData;
    const text = clipboardData.getData('Text');
    document.execCommand('inserttext', false, text);
  }
  function handleFocus (event) {
    document.execCommand("defaultParagraphSeparator", false, "p");
    notesEditor.update((config) => {
      return {...config, editor: commentElement}
    })
  }
  async function handleBlur (event) {
    if (comment) {
      commented = true
      await saver()
    }
    notesEditor.update((config) => {
      return {...config, editor: null,  focus: document.getSelection().getRangeAt(0).cloneRange()}
    })
  }
  function saver() {
    const json = { ...note.json, comment };
    const payload = { ...note, json };
    document.querySelectorAll(`[data-note-id="${note.id}"]`).forEach(node => {
      node.classList.add("Commented");
    });
    update(payload);
  }
  function handleButtonStatus (event) {
    let focus = document.getSelection().focusNode;
    if (!focus.closest && focus.parentElement) {
      focus = focus.parentElement
    }
    const bold = focus.closest('b,strong');
    const italic = focus.closest('i,em');
    notesEditor.update((config) => {
      return {...config, bold, italic}
    })
  }
  $: if (current && commentElement && current === note.id) {
    commentElement.focus()
  }
  let archived;
  let noteLabel = "show";
  $: if (note.json.label) {
    noteLabel = note.json.label;
  }
  let label
  $: if (label) {
    if (label === 'demote') {
      archived = true;
    } else {
      archived = false;
    }
    // updateLabel().catch(err => console.error(err));
  }
  function updateLabel (event) {
    const json = { ...note.json, label: event.detail.label };
    note = { ...note, json };
    try {
      return update({ ...note, json });
    } catch (err) {}
  }
</script>

<style>
  .AnnotationsHighlight {
    --reader-font-size: 0.85rem;
    font-size: var(--reader-font-size);
    position: relative;
    margin-bottom: calc(var(--reader-paragraph-spacing) * 2);
  }
  .AnnotationsHighlight[data-label="flag"] {
    background-color: #feff9c;
  }
  .AnnotationsHighlight[data-label="question"] {
    background-color: var(--rc-lighter);
  }
  .body {
    display: grid;
    grid-template-columns: 2rem 1fr 3rem;
    align-items: center;

    width: 100%;
  }
  .AnnotationsHighlight.archived {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-style: italic;
    color: #666;
    padding-bottom: 0;
    padding: 0;
    padding-left: 0;
    font-size: 0.75rem;
    margin-top: var(--reader-paragraph-spacing);
    margin-bottom: calc(var(--reader-paragraph-spacing) * 2);
  }
  .AnnotationsHighlight.selected {
    border-color: #ddd;
  }
  :global(.AnnotationsHighlight > *) {
    grid-column: 2 / 3;
  }
  .AnnotationsHighlight .Chapter {
    --reader-font-size: 1.1rem;
    position: relative;
    margin: 0;
    padding: 0;
    line-height: var(--reader-line-height);
    color: var(--reader-text-color);
    grid-column: 2 / 3;
  }
  .AnnotationsHighlight .ReaderComment {
    position: relative;
    --reader-font-size: 0.85rem;
    display: block;
    padding-left: 1.25rem;
    /* padding-top:24px; */
    padding-right: 2.5rem;
    background-color: white;
    grid-column: 1 / -1;
    --reader-paragraph-spacing: 0.25rem;
    border-left: 0.25rem solid transparent;
    outline: 1px solid #e6e6e699;
    padding: 0.25rem 1.25rem 0.25rem 1.5rem;
  }
  .AnnotationsHighlight:hover .ReaderComment, .AnnotationsHighlight .ReaderComment:focus {
    background-color: white;
    border-left: 0.25rem solid #eded00;
    outline: 2px solid #68d6d499;
    outline-offset: 1px;
  }
  .AnnotationsHighlight .ReaderComment.commented {
    background-color: white;
    border-left: 0.25rem solid #eded00;
    outline: none;
  }
  /* .AnnotationsHighlight.selected .ReaderComment {
    background-color: #fafafa;
  } */
  .AnnotationsHighlight .Chapter > :global(blockquote) {
    padding-left: 1em;
    padding-right: 1rem;
    margin-left: 0;
    margin-top: var(--reader-paragraph-spacing);
    margin-bottom: var(--reader-paragraph-spacing);
    line-height: 1.2;
    font-family: var(--reader-font-family);
    font-style: italic;
  }
  .AnnotationsHighlight .Chapter > :global(blockquote i), .AnnotationsHighlight .Chapter > :global(blockquote em) {
    font-style: normal;
  }
  .archive {
    text-transform: uppercase;
    position: absolute;
    top: 0;
    right: 0;
    font-size: 0.85rem;
    z-index: 1;
    text-decoration: none;
    visibility: hidden;
  }
  .archive:focus {
    visibility: visible;
  }
  .Chapter:hover .archive {
    visibility:visible;
  }
  .AnnotationsHighlight:focus-within .archive {
    visibility: visible;
  }
  .Chapter .archive :global(a) {
    text-decoration: none;
  }
  .title {
    text-transform: uppercase;
    font-size: 0.75rem;
    margin: 0;
    padding: 0 1rem;
    display: block;
    text-decoration: none;
  }
  /* .AnnotationsHighlight :global(blockquote)::before {
    position: absolute;
    top: 0.25rem;
    left: 0.25rem;
    color: #eee;
    content: "‘";
    font-size: 4rem;
  } */
  /* .AnnotationsHighlight :global(blockquote)::after {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    color: #eee;
    content: "’";
    font-size: 4rem;
  } */
  .Highlight-link {
    top: 0;
    left: 0;
    /* background-color: var(--main-background-color);
    border-radius: 0.5rem; */
    color: var(--medium);
    grid-column: 1 / 2;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .archived .Highlight-link {
    top: 0.25rem;
  }
</style>

<!-- markup (zero or more items) goes here -->
{#if !archived && collection}
  <a class="title" href={note.publication.url}>{note.publication.name}</a>
{/if}
<div class="AnnotationsHighlight" class:selected class:archived data-label={label}>
<div class="body">
    <span class="Highlight-anchor" id={`note-${encode(note.id)}`}>&nbsp;</span>
  {#if !collection && !modal && !archived}
    <a class="Highlight-link" href={`${window.location.pathname}#highlight-${encode(note.id)}`} aria-label="Go to highlight in text"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></a>
    {:else}
      <span></span>
  {/if}
    {#if archived}
      <span>
        {#if collection}{note.publication.name}:{/if}
        {note['oa:hasSelector'].exact.slice(0, 50)}...
      </span>
    {:else}
      <div class="Chapter">
        {@html highlight}
      </div>
    {/if}
  <LabelMenu bind:label={label} {noteLabel} {label} on:label-change={updateLabel} />
</div>
  {#if !archived}
    
      <div class="ReaderComment" contenteditable="true" bind:innerHTML={comment}  on:paste={handlePaste} on:focus={handleFocus} on:blur={handleBlur} on:keyup={handleButtonStatus} on:mouseup={handleButtonStatus} bind:this={commentElement} class:commented data-editor-note-id={note.id}>
      </div>
  {/if}
</div>
