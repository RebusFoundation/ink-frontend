<script>
  // your script goes here
  import { decode, encode } from "universal-base64url";
  import Highlight from "./Highlight.svelte";
  export let notes;
  export let index;
  export let withSidebar = false;
  export let collection;
  $: if (withSidebar && notes) {
    notes.forEach(note => {
      note.publication = processPublication(note.publication);
    });
  }
  function processPublication(item) {
    if (!item) return {};
    if (item.id && withSidebar) {
      // We base64url encode the url here because a lot of CDNs have problems with urls in urls, even when properly escaped as URL components.
      item.url = `/collections/${collection}/notes/${encode(item.id)}${
        window.location.search
      }`;
    } else if (item.id) {
      const pathname = new URL(item.id).pathname;
      item.url = `/info${pathname}metadata`;
    }
    return item;
  }
</script>

<style>
  /* your styles go here */
  .title {
    text-transform: uppercase;
    font-size: 0.75rem;
    margin: 0;
    padding: 0 1rem;
    display: block;
    text-decoration: none;
  }
</style>

<!-- markup (zero or more items) goes here -->
<div class="NotesList">
  {#if notes}
    {#each notes as note}
      <div class="Note">
        <a class="title" href={note.publication.url}>{note.publication.name}</a>
        <Highlight {note} />
      </div>
    {/each}
  {/if}
</div>
