<script>
  import NotesList from "../src/library/NotesList.svelte";
  // your script goes here
  export let layout;
  export let notes;
  export let current;
  export let collection;
</script>

<style>
  /* your styles go here */
  .wrapper {
    padding: 1rem;
    background-color: var(--main-background-color);
  }
</style>

<div class="wrapper">
  <NotesList {layout} {notes} {collection} {current} />
</div>

<!-- markup (zero or more items) goes here -->
