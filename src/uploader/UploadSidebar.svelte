<script>
  import Upload from "./Upload.svelte"
  import UploadQueue from "../uploader/UploadQueue.svelte";
  import { uploadQueue } from "../uploader/upload-doc.js";
  export let modal = false;
  export let collection;
  function fileDrop(files) {
    for (let file of files) {
      uploadQueue.add(file);
    }
  }
</script>

<style>
  .top {
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: sticky;
    top: 0;
    background-color: var(--sidebar-background-color);
    margin: 0 0 0.5rem;
  }
  h2 {
    text-align: center;
    font-size: 1rem;
    margin: 0;
    color: var(--medium);
    font-weight: 600;
    font-size: 0.75rem;
    text-transform: uppercase;
  }
  h1 {
    text-align: center;
    font-size: 3rem;
    margin-top: 3rem;
    color: var(--medium);
    font-weight: 600;
  }
  .upload {
    padding: 0.25rem 1rem;
  }
</style>


<div class="sidebar">
{#if modal}
  <h1>Upload to <em>{collection}</h1>
{:else}
      <div class="top">
        <h2>Upload to <em>{collection}</em></h2>
      </div>
{/if}
  <div class="upload">
    <Upload upload={fileDrop} />
  </div>
  {#if uploadQueue}
    <UploadQueue queue={uploadQueue} />
  {/if}
</div>