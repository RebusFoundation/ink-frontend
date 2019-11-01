<script>
  import Highlight from "./Highlight.svelte";
  export let notes;
  export let withSidebar = false;
  export let type;
  export let id;
</script>

<style>
  /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->
<div class="NotesList">
  {#if notes}
    {#each notes as note}
      <div class="Note">
        <Highlight {note} collection={false} current={false} modal={false} info={true} />
      </div>
    {/each}
  {/if}
</div>
