<script>
  import Button from "./Button.svelte";
  import TextButton from "./TextButton.svelte";
  import { book as item, current } from "../stores/book.js";
  import { collections } from "../collections/store.js";
  import { collection } from "../api/collection.js";
  export let modal;
  let book = { navigation: { current: {} } };
  $: if ($item.id && $item.id !== book.id) {
    updateBook($item.id);
  }
  let bookTags = [];
  $: if (book.tags) {
    bookTags = book.tags.map(tag => tag.id);
  }
  async function updateBook(id) {
    book = { navigation: { current: {} }, json: {}, readingOrder: [{}] };
    const response = await fetch(`/api/book?url=${encodeURIComponent(id)}`);
    book = await response.json();
    return book;
  }
  let checkboxes = {};

  function handleCollection(tag, input) {
    collection(tag, $item, input.checked);
  }
</script>

<style>
  h1 {
    text-align: center;
    font-size: 2rem;
    margin-top: 2rem;
    color: var(--medium);
    font-weight: 600;
  }
  ol,
  .return {
    margin: 1rem auto;
    min-width: 250px;
    max-width: 450px;
    width: 100%;
    padding: 0;
  }
  ol a {
    text-decoration: none;
    display: block;
    padding: 0.25rem 1rem;
    border-radius: 0;
    margin-left: -1px;
  }
  ol a:hover {
    background-color: var(--hover);
    color: var(--light);
  }
  ol a:focus {
    background-color: var(--rc-lighter);
    color: black;
  }
  ol li {
    list-style: none;
  }
  .return {
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
  .return:hover {
    background-color: var(--hover);
    color: var(--light);
  }
  .return svg {
    height: 14px;
    width: 16px;
  }
  .return.modal {
    margin-top: 32px;
  }
  ol a.current {
    border-left: 5px solid var(--rc-darker);
    padding-left: calc(1rem - 6px);
    font-weight: 600;
  }
  .Collections {
    font-size: 1rem;
    text-transform: uppercase;
    margin-top: 1rem;
    margin-bottom: 0;
    text-align: left;
    padding: 0 1rem;
    margin: 1rem auto;
    min-width: 250px;
    max-width: 450px;
  }
  .CollectionsList label {
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0.25rem 1rem;
  }
  .CollectionsList label.checked {
    font-weight: 600;
  }
  .CollectionsList label:hover {
    background-color: var(--hover);
    color: var(--light);
    cursor: pointer;
  }

  @supports (-webkit-appearance: none) {
    input[type="checkbox"] {
      -webkit-appearance: none;
      width: 1.6rem;
      height: 1.6rem;
      border: 1px solid #808080;
      border-radius: 0.25rem;
      margin-right: 0.5rem;
    }
    input[type="checkbox"]:focus {
      border: 1px solid var(--rc-darker, #ccc);
    }
    input[type="checkbox"]:checked {
      position: relative;
      background: none;
      border-color: white;
      background: var(--rc-darker);
    }
    input[type="checkbox"]:checked::after {
      position: absolute;
      top: 0.36rem;
      left: 0.12rem;
      content: "";
      width: 1rem;
      height: 0.3rem;
      border: 2px solid white;
      border-right: none;
      border-top: none;
      transform: rotate(-45deg);
    }
  }
</style>

{#if $current}
  <a href="/collections/all" class="return" data-close-modal class:modal>
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
{/if}
{#if modal}
  <h1>{$item.name}</h1>
{/if}
<ol>
{#if book.json.epubVersion}
  <li>
    <a
      class:item={true}
      href={book.navigation.current.path}
      data-close-modal
      class:current={$current === 'read'}>
      {book.position ? 'Continue' : 'Read'}
    </a>
  </li>
  <li>
    <a
      href="/assets{new window.URL(book.id + 'original.epub').pathname}">
      Download original
    </a>
  </li>
  {:else if  book.readingOrder[0] && book.readingOrder[0].url}
  <li>
    <a
      href="/assets{new window.URL(book.readingOrder[0].url).pathname}">
      Download original
    </a>
  </li>
  {:else}
  <li>
    <a
      href="/">
      Download original
    </a>
  </li>
{/if}
  <li class="first-item">
    <a
      href="{$item.url}metadata"
      data-close-modal
      class:current={$current === 'metadata'}>
      Metadata
    </a>
  </li>
  <li>
    <a
      href="{$item.url}contents"
      data-close-modal
      class:current={$current === 'contents'}>
      Contents
    </a>
  </li>
  <li class="last-item">
    <a
      href="{$item.url}annotations"
      data-close-modal
      class:current={$current === 'annotations'}>
      Annotations
    </a>
  </li>
</ol>

{#if $collections}
  <h2 class="Collections">Collections</h2>
  <ol class="CollectionsList">
    {#each $collections as tag, i}
      <li>
        <label class:checked={checkboxes[i] || bookTags.includes(tag.id)}>
          <input
            type="checkbox"
            value={tag.name}
            bind:checked={checkboxes[i]}
            checked={bookTags.includes(tag.id)}
            id={tag.name}
            on:change={event => handleCollection(tag, event.target)} />
          {tag.name}
        </label>
      </li>
    {/each}
  </ol>
{/if}
