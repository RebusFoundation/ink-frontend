<script>
  // your script goes here
  import DOMPurify from "dompurify";
  import LabelMenu from "../components/LabelMenu.svelte";
  import { decode, encode } from "universal-base64url";
  import { update } from "../api/update.js";
  import TextButton from "../components/TextButton.svelte";
  import { afterUpdate, tick } from "svelte";
  import { stores } from "../stores";
  const { notesEditor } = stores();
  const purifyConfig = {
    KEEP_CONTENT: false,
    FORBID_TAGS: ["style", "link"],
    FORBID_ATTR: ["style"]
  };
  export let note;
  export let current;
  export let collection = false;
  export let modal = false;
  export let info = false;
  let highlight;
  let comment;
  let oldComment;
  let commented = false;
  $: highlight = DOMPurify.sanitize(note.content, purifyConfig);
  let focused = false;

  $: if (note.json.comment || comment) {
    commented = true;
  } else {
    commented = false;
  }
  let selected;
  $: if (current === note.id) {
    selected = true;
  }
  let commentElement;
  function handlePaste(event) {
    event.stopPropagation();
    event.preventDefault();
    const clipboardData = event.clipboardData || window.clipboardData;
    const text = clipboardData.getData("Text");
    document.execCommand("inserttext", false, text);
  }
  function handleFocus(event) {
    document.execCommand("defaultParagraphSeparator", false, "p");
    focused = true;
    notesEditor.update(config => {
      return { ...config, editor: commentElement, ...checkButtonStatus() };
    });
  }
  async function handleBlur(event) {
    focused = false;
    if (comment) {
      commented = true;
      await saver();
    }
    notesEditor.update(config => {
      return { ...config, editor: null, bold: null, italic: null };
    });
  }
  function saver() {
    const json = { ...note.json, comment };
    const payload = { ...note, json };
    document.querySelectorAll(`[data-note-id="${note.id}"]`).forEach(node => {
      node.classList.add("Commented");
    });
    update(payload);
  }
  function checkButtonStatus() {
    let focus = document.getSelection().focusNode;
    if (!focus) return
    if (!focus.closest && focus.parentElement) {
      focus = focus.parentElement;
    }
    const bold = focus.closest("b,strong");
    const italic = focus.closest("i,em");
    return { bold, italic };
  }
  function handleButtonStatus(event) {
    notesEditor.update(config => {
      return { ...config, ...checkButtonStatus() };
    });
  }
  $: if (current && commentElement && current === note.id) {
    commentElement.focus();
  }
  let noteLabel = "show";
  $: if (note.json.label) {
    noteLabel = note.json.label;
  }
  let label;
  function updateLabel(event) {
    const json = { ...note.json, label: event.detail.label };
    note = { ...note, json };
    try {
      return update({ ...note, json });
    } catch (err) {}
  }
  let publicationURL;
  if (collection && note.publication.id) {
    const query = new window.URLSearchParams(window.location.search);
    query.set("item", encode(note.publication.id));
    // We base64url encode the url here because a lot of CDNs have problems with urls in urls, even when properly escaped as URL components.
    publicationURL = `/collections/${collection}/notes/?${query.toString()}`;
  }
</script>

<style>
  .AnnotationsHighlight {
    --reader-font-size: 0.85rem;
    font-size: var(--reader-font-size);
    position: relative;
    margin-bottom: 0;
    padding-bottom: 0.25rem;
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
    margin-top: 0;
    margin-bottom: 0;
    background-color: #fafafa;
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
    background-color: rgba(255, 255, 255, 0.5);
    grid-column: 1 / -1;
    --reader-paragraph-spacing: 0.25rem;
    border-left: 0.25rem solid transparent;
    outline: 1px solid #f0f0f0;
    padding: 0.25rem 1.25rem 0.25rem 1.5rem;
    margin: 0.25rem;
    box-shadow: 1px 2px 2px 0 rgba(133, 133, 133, 0.1);
  }
  .AnnotationsHighlight:hover .ReaderComment,
  .AnnotationsHighlight .ReaderComment:focus {
    background-color: white;
    border-left: 0.25rem solid #eded00;
    outline: 2px solid #68d6d499;
    outline-offset: 1px;
  }
  .AnnotationsHighlight .ReaderComment.commented {
    background-color: white;
    border-left: 0.25rem solid #eded00;
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
  .AnnotationsHighlight .Chapter > :global(blockquote i),
  .AnnotationsHighlight .Chapter > :global(blockquote em) {
    font-style: normal;
  }
  .title {
    text-transform: uppercase;
    font-size: 0.75rem;
    margin: 0.25rem 0;
    padding: 0;
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
{#if note.json.label !== "demote" && collection}
  <a class="title" href={publicationURL}>{note.publication.name}</a>
{/if}
<div
  class="AnnotationsHighlight"
  class:selected
  class:archived={note.json.label === "demote"}
  data-label={note.json.label}>
  <div class="body">
    <span class="Highlight-anchor" id={`note-${encode(note.id)}`}>&nbsp;</span>
    {#if !info && !collection && !modal && note.json.label !== "demote"}
      <a
        class="Highlight-link"
        href={`${window.location.pathname}#highlight-${encode(note.id)}`}
        aria-label="Go to highlight in text">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="square"
          stroke-linejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </a>
    {:else}
      <span />
    {/if}
    {#if note.json.label === "demote"}
      <span>
        {#if collection}{note.publication.name}:{/if}
        {note['oa:hasSelector'].exact.slice(0, 50)}...
      </span>
    {:else}
      <div class="Chapter">
        {@html highlight}
      </div>
    {/if}
    <div>
      <LabelMenu bind:label noteLabel={note.json.label} on:label-change={updateLabel} />
    </div>
  </div>
  {#if note.json.label !== "demote"}
    <div
      class="ReaderComment"
      contenteditable="true"
      bind:innerHTML={comment}
      on:paste={handlePaste}
      on:focus={handleFocus}
      on:blur={handleBlur}
      on:keyup={handleButtonStatus}
      on:mouseup={handleButtonStatus}
      bind:this={commentElement}
      class:commented
      data-editor-note-id={note.id}>{@html DOMPurify.sanitize(note.json.comment, purifyConfig)}</div>
  {/if}
</div>
