<script>
  import Toolbar from "../components/Toolbar.svelte";
  import Uploader from "../uploader/Upload.svelte";
  import UploadQueue from "../uploader/UploadQueue.svelte";
  import { uploadQueue } from "../uploader/upload-doc.js";
  import Recent from "../uploader/Recent.svelte";
  import CollectionsList from "../library/CollectionsList.svelte";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { stores } from "../stores";
  const { recent, title } = stores();
  $: title.set("Recent");
  function fileDrop(files) {
    for (let file of files) {
      uploadQueue.add(file);
    }
  }
  // $: if ($uploadQueue) {
  //   fetch(`/recent.json`)
  //     .then(response => {
  //       if (response.ok) {
  //         return response.json()
  //       } else {
  //         return {}
  //       }
  //     })
  //     .then(json => {
  //       recent = json;
  //     });
  // }
</script>

<style>
  .Front {
    padding: var(--reader-left-margin);
  }

  @media (min-width: 480px) {
  }
</style>

<!-- <script context="module">
  export async function preload(page, session) {
    let recentlyAdded;
    if (session.user && session.user.id) {
      recentlyAdded = await this.fetch(`/recent.json`, { credentials: "include" })
        .then(response => response.json())
        .catch(err => this.error(err));
    }
    return { recentlyAdded };
  }
</script> -->
<svelte:head>
  <title>Uploads – Rebus Ink</title>
</svelte:head>
<div
  class="Front"
  in:fly={{ y: 200, duration: 250, delay: 250 }}
  out:fly={{ y: 200, duration: 250 }}>
  <!-- Uploader -->
  <!-- Recent -->
  {#if $recent}
    <Recent recent={$recent} />
  {/if}
  <CollectionsList />
</div>
