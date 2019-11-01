<script>
  import Button from "./Button.svelte";
  import TextButton from "./TextButton.svelte";
  import { collection } from "../api/collection.js";
  import { stores } from "../stores";
  const { docStore, currentInfoBook, collections } = stores();
  export let modal;
  export let sidebar = false;
  export let history = false;
  export let side;
  let book = { navigation: { current: {} }, json: { epubVersion: "2.0" } };
  $: if ($docStore.id && $docStore.id !== book.id) {
    updateBook($docStore.id);
  }
  let bookTags = [];
  $: if (book.tags) {
    bookTags = book.tags.map(tag => tag.id);
  }
  async function updateBook(id) {
    book = {
      navigation: { current: {} },
      json: { epubVersion: "2.0" },
      readingOrder: [{}]
    };
    const response = await fetch(`/api/book?url=${encodeURIComponent(id)}`);
    book = await response.json();
    return book;
  }
  let checkboxes = {};

  const search = new window.URLSearchParams(window.location.search);
  search.delete("item");
  search.delete("noHistory");
  const url = new window.URL(window.location);
  url.search = search.toString();
  let closeURL = url.href;
  function handleCollection(tag, input) {
    collection(tag, $docStore, input.checked);
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
    background-color: var(--main-background-color);
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
  h2 {
    text-align: center;
    font-size: 1rem;
    margin: 0;
    color: var(--medium);
    font-weight: 600;
    font-size: 0.75rem;
    text-transform: uppercase;
  }
  .wrapper {
    min-width: 300px;
  }
</style>

{#if book.id}
  <div class="wrapper">
    {#if $currentInfoBook && side === 'left'}
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
      <h1>{$docStore.name || ''}</h1>
    {/if}
    <ol>
      {#if book.json.epubVersion}
        <li>
          <a
            class:infoBook={true}
            href={book.navigation.current.path}
            data-close-modal
            class:current={$currentInfoBook === 'read'}>
            {book.position ? 'Continue' : 'Read'}
          </a>
        </li>
        <li>
          <a href="/assets{new window.URL(book.id + 'original.epub').pathname}">
            Download original
          </a>
        </li>
      {:else if book.readingOrder[0] && book.readingOrder[0].url}
        <li>
          <a href="/assets{new window.URL(book.readingOrder[0].url).pathname}">
            Download original
          </a>
        </li>
      {:else}
        <li>
          <a href="/">&nbsp;</a>
        </li>
        <li>
          <a href="/">Download original</a>
        </li>
      {/if}
      <li class="first-item">
        <a
          href="{book.url}metadata"
          data-close-modal
          class:current={$currentInfoBook === 'metadata'}>
          Metadata
        </a>
      </li>
      <li>
        <a
          href="{book.url}contents"
          data-close-modal
          class:current={$currentInfoBook === 'contents'}>
          Contents
        </a>
      </li>
      <li class="last-item">
        <a
          href="{book.url}annotations"
          data-close-modal
          class:current={$currentInfoBook === 'annotations'}>
          Annotations
        </a>
      </li>
    </ol>

    {#if $collections}
      <h2 class="Collections">Manage Collections</h2>
      <ol class="CollectionsList">
        {#each $collections as tag, i}
          <li>
            <label>
              <input
                type="checkbox"
                value={tag.name}
                checked={bookTags.includes(tag.id)}
                id={tag.name}
                on:change={event => handleCollection(tag, event.target)} />
              {tag.name}
            </label>
          </li>
        {/each}
      </ol>
    {/if}
  </div>
{:else}
  <div class="wrapper">&nbsp;</div>
{/if}
