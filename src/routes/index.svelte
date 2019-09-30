<script context="module">
  export async function preload(page, session) {
    let recent;
    if (session.user && session.user.profile && session.user.profile) {
      recent = await this.fetch(`/recent.json`, { credentials: "include" })
        .then(response => response.json())
        .catch(err => this.error(err));
    }
    return { recent };
  }
</script>

<script>
  import Toolbar from "../components/Toolbar.svelte";
  import Uploader from "../uploader/Upload.svelte";
  import UploadQueue from "../uploader/UploadQueue.svelte";
  import { uploadQueue } from "../uploader/upload-doc.js";
  import Recent from "../uploader/Recent.svelte";
  import { onMount } from "svelte";
  import { profile } from "./_profile.js";
  import { open } from "../actions/modal.js";
  export let recent;
  function fileDrop(files) {
    for (let file of files) {
      uploadQueue.add(file);
    }
  }
  $: if ($uploadQueue) {
    fetch(`/recent.json`)
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          return {}
        }
      })
      .then(json => {
        recent = json;
      });
  }
</script>

<style>
  .Front {
    padding: var(--reader-left-margin);
  }

  @media (min-width: 480px) {
  }
</style>

<svelte:head>
  <title>Uploads – Rebus Ink</title>
</svelte:head>
<!-- Menubar -->
<Toolbar>
  <a
    use:open={{ id: 'collections-modal' }}
    slot="left-button"
    href="/"
    class="Toolbar-link">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="square"
      stroke-linejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
    <!-- <span class="Label">Collections</span> -->
  </a>
  <span slot="toolbar-title">Uploads</span>
</Toolbar>
<div class="Front">
  <!-- Uploader -->
  <Uploader upload={fileDrop} />
  {#if uploadQueue}
    <UploadQueue queue={uploadQueue} />
  {/if}
  <!-- Recent -->
  {#if recent}
    <Recent {recent} />
  {/if}
</div>
