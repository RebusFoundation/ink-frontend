<script>
  // your script goes here
  import Highlight from "./Highlight.svelte";
  export let chapter;
  export let index;
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
  .AnnotationsChapter {
    border-top: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
  }
</style>

<!-- markup (zero or more items) goes here -->
<div class="AnnotationsChapter">
  <h2>Chapter {index + 1}</h2>
  {#await annotations}
    <p class="Loading">Loading...</p>
  {:then notes}
    {#each notes.items as note}
      <Highlight {note} />
    {/each}
  {:catch error}
    <!-- promise was rejected -->
  {/await}
</div>
