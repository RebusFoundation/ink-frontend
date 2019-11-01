<script>
  // your script goes here
  import { onMount } from "svelte";
  export let upload = files => console.log(files);
  let form;
  onMount(() => {
    if (!document.getElementById("import-pdf-cover-page")) {
      const canvas = document.createElement("canvas");
      canvas.id = "import-pdf-cover-page";
      canvas.hidden = true;
      canvas.setAttribute("style", "display: none;");
      document.body.appendChild(canvas);
    }
  });
</script>

<style>
  /* your styles go here */
  .FileDrop {
    display: block;
    flex: 1 1 100%;
    border-radius: 0.25rem;
    display: flex;
    flex-direction: column;
    border: 2px dotted var(--rc-dark);
    background-color: var(--rc-lighter);
    margin: 0.25rem 0;
    padding: 1rem;
  }
  @keyframes uploaderPop {
    0% {
      box-shadow: 0 0 0 1px rgba(33, 33, 33, 0);
    }
    50% {
      box-shadow: 0 0 0 8px #2ed0ac;
    }
    100% {
      box-shadow: 0 0 0 3px #2ed0ac;
    }
  }
  @keyframes uploaderPopInvalid {
    0% {
      box-shadow: 0 0 0 1px rgba(33, 33, 33, 0);
    }
    50% {
      box-shadow: 0 0 0 8px #ff3b3b;
    }
    100% {
      box-shadow: 0 0 0 3px #ff3b3b;
    }
  }
  :global(.FileDrop.drop-valid) {
    border: 2px solid #2ed0ac;
    background-color: #f1fffd;
    animation: uploaderPop 0.25s ease-in-out;
  }
  :global(.FileDrop.drop-invalid) {
    animation: uploaderPopInvalid 0.25s ease-in-out;
    border: 2px solid #ff3b3b;
    background-color: #fdf6f5;
  }
  .FileDrop p {
    margin: 0.25rem;
    padding: 0;
    text-align: center;
    font-size: 0.85rem;
    line-height: 1;
    color: var(--rc-darker);
  }
  .input {
    text-indent: 3rem;
  }
  @keyframes uploaderButtonPop {
    0% {
      transform: scale(0.8);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
</style>

<file-drop
  class="FileDrop"
  accept=".epub,.pdf,application/epub+zip,application/pdf"
  multiple
  on:filedrop={event => upload(event.files)}>
  <p>Drop file here</p>
  <p>or</p>
  <form class="input" bind:this={form}>
    <input
      type="file"
      name="file-selector"
      id="file-selector"
      accept=".epub,.pdf,application/epub+zip,application/pdf"
      multiple
      on:change={event => {
        upload(event.target.files);
        form.reset();
      }} />
  </form>
</file-drop>
