<script>
  import { onMount, tick } from "svelte";
  import { collection as setCollection } from "../api/collection.js";
  import { preRender } from "../routes/doc/[id]/_utils.js";
  import { stores } from "../stores";
  const { collections, recent, jobs } = stores();
  export let job;
  export let collection;
  let publication;
  onMount(() => {
    check(testJob, 300000, 3000);
  });
  async function check(fn, timeout, interval) {
    const endTime = Number(new Date()) + (timeout || 2000);
    interval = interval || 100;
    while (!(job.finished || job.error)) {
      const result = await fn();
      if (result && (result.finished || result.error)) {
        job = result;
        await processPublication(job);
        return result;
      } else if (Number(new Date()) < endTime) {
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    }
  }
  async function processPublication(job) {
    const tag = $collections.find(tag => tag.name === collection);
    const publicationResponse = await window.fetch(
      `/api/get?path=${encodeURIComponent(
        `/publication-${job.publicationId}/`
      )}&publication=true`,
      { credentials: "include" }
    );
    publication = await publicationResponse.json();
    recent.update(recentStore => {
      recentStore.items = [publication].concat(recentStore.items);
      return recentStore;
    });
    jobs.update(list => {
      const index = list.map(item => item.id).indexOf(job.id);
      list[index] = job;
      return list;
    });
    if (collection && collection !== "all") {
      await setCollection(
        tag,
        { id: `/publication-${job.publicationId}/` },
        true
      );
    }
    return preRender(publication);
  }
  async function testJob() {
    try {
      const response = await window.fetch(
        `/api/get?path=${encodeURIComponent(`/job-${job.id}`)}`,
        { credentials: "include" }
      );
      return response.json();
    } catch (err) {
      return { error: true };
    }
  }
</script>

<style>
  /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->
<li>
  {#if job.error}
    Error processing epub
  {:else if publication}{publication.name} imported{:else}&nbsp;{/if}
</li>
