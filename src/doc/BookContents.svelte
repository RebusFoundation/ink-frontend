<script>
  import { stores } from "../stores";
  import Contents from "./Contents.svelte";
  import TextButton from "../components/TextButton.svelte";
  const { contents, docStore, configuringReader, chapterStore } = stores();
  export let modal = false;
</script>

<style>
  .BookContents {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    height: 100vh;
    max-height: 100vh;
    background-color: var(--sidebar-background-color);
    min-width: 250px;
    font-size: 0.75rem;
  }
  @media (max-width: 400px) {
    .BookContents {
      font-size: 0.65rem;
    }
  }
  .BookContents.modal {
    background-color: white;
    padding-top: 32px;
  }
  .return,
  .TextButton {
    display: inline-block;

    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    text-align: center;
    white-space: nowrap;
    text-decoration: none;

    color: var(--link);
    border: none;
    background-color: transparent;

    -ms-touch-action: manipulation;
    touch-action: manipulation;
    text-transform: uppercase;
    text-decoration: none;
    line-height: 0.1;
    display: flex;
    align-items: center;
    padding: 0.5rem calc(1rem - 16px);
    text-transform: uppercase;
    font-size: 0.75rem;
    border-radius: 0;
    margin-top: 0;
  }
  .TextButton {
    padding: 0 1rem;
    text-align: right;
    display: inline-block;
  }
  .return:hover,
  .TextButton:hover {
    background-color: var(--hover);
    color: var(--light);
  }
  .return svg {
    height: 14px;
    width: 16px;
  }
  .TopButtons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-bottom: 2rem;
  }
</style>

<div class="BookContents" class:modal>
  <div class="TopButtons">
    <a href="/collections/all" class="return" data-close-modal>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="square"
        stroke-linejoin="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
      Library
    </a>
    <button
      data-close-modal
      class="TextButton"
      on:click={event => {
        configuringReader.update(state => !state);
      }}>
      {#if $configuringReader}Done{:else}Reader Settings{/if}
    </button>
  </div>
  {#if $contents.children && $docStore}
    <Contents contents={$contents} book={$docStore} chapter={$chapterStore} />
  {/if}
</div>
