<script>
  // your script goes here
  import { stores } from "../stores";
  import Job from "./Job.svelte";
  import { collection as setCollection } from "../api/collection.js";
  export let collection;
  const { jobs, collections } = stores();
  let queue;
  let tagged = [];
  $: if ($jobs) {
    queue = $jobs.filter(job => job.finished || job.error || job.published);
    // if (collection && collection !== 'all') {
    //   const done = $jobs.filter(job => (!job.finished || !job.published) && tagged.indexOf(job.id) === -1);
    //   for (job of done) {
    //     const tag = $collections.filter(item => item.name === collection)
    //     collection(tag, `/${job.publicationId}/`, true).then(() => {
    //       tagged = tagged.concat(jobs.id)
    //     }).catch(err => console.error(err));
    //   }
    // }
  }
</script>

<style>
  .UploadQueue ol {
    list-style: none;
    margin: 0;
    padding: 0.5rem 1rem;
  }
</style>

{#if $jobs && $jobs.length > 0}
  <div class="UploadQueue">
    <ol>
      {#each $jobs as job}
        <!-- content here -->
        <Job {job} {collection} />
      {/each}
    </ol>
  </div>
{/if}
