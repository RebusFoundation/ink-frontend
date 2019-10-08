<script>
  import { decode, encode } from "universal-base64url";
  import TextButton from "../components/TextButton.svelte";
  import Button from "../components/Button.svelte";
  import Editor from "../components/Editor.svelte";
  import DOMPurify from "dompurify";
  import { remove as deleter } from "../api/remove.js";
  import { stores } from "../stores";
  import { goto } from "@sapper/app";
  const {note} = stores();
  const purifyConfig = {
    KEEP_CONTENT: false,
    RETURN_DOM: true,
    FORBID_TAGS: ["style", "link"],
    FORBID_ATTR: ["style"]
  };
  let remove;
  function removeHighlight() {
    document
      .querySelectorAll(`reader-highlight[data-note-id="${note.id}"]`)
      .forEach(highlight => highlight.replaceWith(...highlight.childNodes));
    // Need to actually delete
    deleter(note);
  }
  let blockquote;
  $: if ($note && process.browser) {
    let dom = DOMPurify.sanitize(note.content, purifyConfig);
    blockquote = dom.querySelector("blockquote").outerHTML;
  }
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
</style>

<!-- Instead of doing this we should be using <a> tags instead of custom <reader-marker> tags to mark highlights. That way we automatically get accessible navigation to note editing. -->
<svelte:window
  on:highlight-selected={event => {
    note.set({...event.detail.note, loading: true});
    const search = new window.URLSearchParams(window.location.search)
    search.set("note", encode(event.detail.note.id))
    const url = new window.URL(window.location)
    url.search = search.toString()
    return goto(url)
  }} />

  <div class="NoteModal">
    {#if remove}
      <p>
        Are you sure you want to remove this highlight? This action cannot
        be undone.
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
      <Editor {$note} />
    {/if}
  </div>
