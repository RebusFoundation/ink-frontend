<script>
  import { decode, encode } from "universal-base64url";
  import TextButton from "../components/TextButton.svelte";
  import Button from "../components/Button.svelte";
  import Editor from "../components/Editor.svelte";
  import DOMPurify from "dompurify";
  import { remove as deleter } from "../api/remove.js";
  import { stores } from "../stores";
  import { goto } from "@sapper/app";
  export let id;
  export let side;
  const { note } = stores();
  const purifyConfig = {
    KEEP_CONTENT: false,
    RETURN_DOM: true,
    FORBID_TAGS: ["style", "link"],
    FORBID_ATTR: ["style"]
  };
  let remove;
  function removeHighlight() {
    document
      .querySelectorAll(`reader-highlight[data-note-id="${id}"]`)
      .forEach(highlight => highlight.replaceWith(...highlight.childNodes));
    // Need to actually delete
    deleter(note);
  }
  let blockquote;
  $: if (id && !$note.content && process.browser) {
    window
      .fetch(`/api/get?path=${encodeURIComponent(id)}`)
      .then(response => response.json())
      .then(item => note.set(item))
      .catch(err => console.error(err));
  } else if ($note.content && process.browser) {
    let dom = DOMPurify.sanitize($note.content, purifyConfig);
    blockquote = dom.querySelector("blockquote").outerHTML;
  }
  const search = new window.URLSearchParams(window.location.search);
  search.delete("note");
  search.delete("noHistory");
  const url = new window.URL(window.location);
  url.search = search.toString();
  let closeURL = url.href;
</script>

<style>
  .Chapter {
    font-family: var(--reader-font-family);
  }
  .NoteModal {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    height: 100vh;
    max-height: 100vh;
    padding: 32px;
    min-width: var(--reader-min-column-width);
    max-width: var(--reader-max-column-width);
    margin: 0 auto;
    position: relative;
  }
  .NoteModal .Chapter {
    border-left: 0.25rem solid var(--rc-darker);
    padding: 0.25rem 0.5rem;
  }
  .Deleter {
    position: absolute;
    top: 0;
    right: 0;
  }
  .Closer {
    font-size: 0.75rem;
    text-transform: uppercase;
    text-decoration: none;

    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    text-align: center;
    white-space: nowrap;
    text-decoration: none;
    display: inline-block;

    color: var(--link);
    border: none;
    background-color: transparent;
    position: absolute;
    top: 0;
    left: 0;
  }
  .Closer:hover {
    color: var(--hover);
  }
  .Closer svg {
    vertical-align: middle;
  }
</style>

<!-- Instead of doing this we should be using <a> tags instead of custom <reader-marker> tags to mark highlights. That way we automatically get accessible navigation to note editing. -->
<svelte:window
  on:highlight-selected={event => {
    note.set({ ...event.detail.note, loading: true });
    const search = new window.URLSearchParams(window.location.search);
    search.set('note', encode(event.detail.note.id));
    const url = new window.URL(window.location);
    url.search = search.toString();
    return goto(url);
  }} />

{#if $note.id && $note.content}
  <div class="NoteModal">
    <a
      href={closeURL}
      class="Closer"
      aria-label="Close sidebar"
      sapper-noscroll>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="square"
        stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </a>
    {#if remove}
      <p>
        Are you sure you want to remove this highlight? This action cannot be
        undone.
      </p>
      <Button
        click={event => {
          remove = false;
        }}
        noClose={true}>
        No, keep the highlight
      </Button>
      <TextButton
        click={event => {
          removeHighlight();
        }}
        warning
        close={true}>
        Yes, remove Highlight
      </TextButton>
    {:else}
      <span class="Deleter">
        <TextButton
          click={event => {
            remove = true;
          }}
          warning
          noClose={true}>
          Delete Highlight
        </TextButton>
      </span>

      <div class="Chapter">
        {@html blockquote}
      </div>
      <Editor note={$note} />
    {/if}
  </div>
{/if}
