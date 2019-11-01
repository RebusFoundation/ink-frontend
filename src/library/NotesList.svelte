<script>
  // your script goes here
  import { decode, encode } from "universal-base64url";
  import Highlight from "./Highlight.svelte";
  export let notes = [];
  export let index;
  export let withSidebar = false;
  export let collection;
  export let current;
  export let modal = false;
</script>

<style>
  /* your styles go here */
  .NotesList {
    min-height: calc(100vh - 64px);
  }
</style>

<!-- markup (zero or more items) goes here -->
<div class="NotesList">
  {#each notes as note}
    <div class="Note">
      <Highlight {note} {current} {collection} {modal} />
    </div>
  {/each}
</div>
