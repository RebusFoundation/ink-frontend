<script>
  import { modal, setup, open } from "../actions/modal.js";
  import { fly, fade } from "svelte/transition";
  import Button from "../components/Button.svelte";
  import TextButton from "../components/TextButton.svelte";
  import { goto } from "@sapper/app";
  export let id;
  // function update() {
  //   fetch(`/recent.json`)
  //     .then(response => {
  //       if (response.ok) {
  //         return response.json()
  //       } else {
  //         return {}
  //       }
  //     })
  //     .then(json => {
  //       collections.set(json.tags);
  //     });
  // }
  // onMount(async () => {
  //   if ($collections.length === 0) {
  //     update();
  //   }
  // });
</script>

<style>
  .Modal[hidden] [role="document"] {
    opacity: 0;
    transform: translateX(-100%);
  }
  .Modal:not([hidden]) [role="document"] {
    background-color: rgba(255, 255, 255, 0.95);
    -webkit-backdrop-filter: blur(7px) saturate(50%);
    backdrop-filter: blur(7px) saturate(50%);
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    box-shadow: 1px 1px 14px -2px rgba(0, 0, 0, 0.15);
    z-index: 10;
    -webkit-overflow-scrolling: touch;
    overflow-y: auto;
  }
  @supports (backdrop-filter: blur(7px)) or (-webkit-backdrop-filter: blur(7px)) {
    .Modal:not([hidden]) [role="document"] {
      background-color: rgba(255, 255, 255, 0.85);
      -webkit-backdrop-filter: blur(7px) saturate(50%);
      backdrop-filter: blur(7px) saturate(50%);
    }
  }
  .Modal [role="document"] {
    position: relative;
    display: flex;
    align-items: center;
  }
  .Closer {
    position: absolute;
    top: 0.5rem;
    left: 1rem;
    line-height: 1;
    font-size: 1.25rem;
    transform: translateY(-2px);
    display: inline-block;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    text-align: center;
    white-space: nowrap;
    text-decoration: none;
    text-transform: uppercase;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    border: none;
    background-color: transparent;
    color: var(--rc-dark);
    height: 24px;
    width: 24px;
    margin: 0;
    padding: 0;
    border-radius: 9999px;
  }
  .Closer:focus {
    outline: solid transparent;
    background-color: #f5f5f5;
    box-shadow: 0 0 1px 1px var(--rc-light), inset 0 0 1px 1px var(--rc-light);
  }
</style>

<div class="Modal" use:setup {id} hidden>
  {#if $modal && $modal.id === id}
    <div role="document" transition:fade={{ duration: 100 }}>
      <button
        type="Button"
        data-close-modal
        class="Closer"
        on:click={event => {
          const search = new window.URLSearchParams(window.location.search)
          search.delete(id.replace('-modal', ''))
          const url = new window.URL(window.location)
          url.search = search.toString()
          return goto(url)
        }} aria-label="Close">
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
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <slot></slot>
    </div>
  {/if}
</div>
