<script>
  // your script goes here
  import InfoNotesList from "./InfoNotesList.svelte";
  export let chapter;
  export let index;
  export let id;
  export let type;
  let annotations = window
    .fetch(`/api/notes?path=${encodeURIComponent(chapter.url)}`)
    .then(response => response.json());
</script>

<style>
  /* your styles go here */
  h2 {
    text-align: center;
    margin: 1rem 0;
    padding: 0;
    color: var(--medium);
  }
</style>

<!-- markup (zero or more items) goes here -->
<div class="AnnotationsChapter">
  {#await annotations}
    <p class="Loading">Loading...</p>
  {:then notes}
    <InfoNotesList notes={notes.items} {id} {type} />
  {:catch error}
    <!-- promise was rejected -->
  {/await}
</div>
