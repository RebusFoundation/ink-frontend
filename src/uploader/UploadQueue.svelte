<script>
  // your script goes here
  export let queue;
</script>

<style>
  /* your styles go here */
  .UploadQueue h2 {
    transition: box-shadow 0.1s cubic-bezier(0.9, 0.03, 0.69, 0.22),
      transform 0.1s cubic-bezier(0.9, 0.03, 0.69, 0.22);
    text-transform: uppercase;
    border-radius: 2rem;
    font-size: 0.7rem;
    color: var(--medium);
    padding: 0.25rem 1rem;
  }
  .UploadQueue ol {
    list-style: none;
    margin: 0;
    padding: 0.5rem 1rem;
  }
</style>

<div class="UploadQueue">
  <h2>
    {#if $queue.length === 1}
      Uploading {$queue.length} file
    {:else if $queue.length !== 0}
      Uploading {$queue.length} files
    {:else}Upload queue is empty{/if}
  </h2>
  <ol>
    {#each $queue as file}
      <!-- content here -->
      <li>{file.name}</li>
    {/each}
  </ol>
</div>
