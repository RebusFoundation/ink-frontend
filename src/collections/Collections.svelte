<script>
  import Button from "../components/Button.svelte";
  import TextButton from "../components/TextButton.svelte";
  import { onMount } from "svelte";
  import { create } from "../api/create.js";
  import { removeMany } from "../api/remove.js";
  import { stores, goto } from "@sapper/app";
  import { stores as inkStores } from "../stores";
  const { collections } = inkStores();
  const { page } = stores();
  export let modal = false;
  let current;
  $: if ($page.params && $page.params.collection) {
    [current] = $page.params.collection;
  } else {
    current = "Recent";
  }
  let creating;
  let deleting;
  let name = "";
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
  function submitForm(event) {
    event.preventDefault();
    const tag = {
      type: "reader:Tag",
      tagType: "reader:Stack",
      name
    };
    create(tag).then(() => {
      name = "";
      creating = false;
      collections.update(list => [tag, ...list]);
      return update();
    });
  }
  function submitDelete(event) {
    event.preventDefault();
    const form = event.target;
    const tags = Array.from(form.querySelectorAll("input:checked")).map(
      node => node.value
    );
    const deleted = $collections.filter(item => tags.includes(item.name));
    if (
      window.confirm(
        `Are you sure you want to permanently delete the selected collections? This action cannot be undone.`
      )
    ) {
      removeMany(deleted).then(() => {
        deleting = false;
        collections.update(list =>
          list.filter(item => !tags.includes(item.name))
        );
        if (tags.includes(current)) {
          goto("/collections/all");
        }
        return update();
      });
    }
  }
  let input;
  $: if (input) {
    input.focus();
  }
  $: console.log(current);
</script>

<style>
  h1 {
    text-align: center;
    font-size: 3rem;
    margin-top: 3rem;
    color: var(--medium);
    font-weight: 600;
  }
  .CollectionBar {
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
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
  ol,
  .Creating {
    margin: 1rem auto;
    min-width: 200px;
    max-width: 450px;
    width: 100%;
  }
  ol a,
  label {
    text-decoration: none;
    display: block;
    padding: 0.25rem 1rem;
    border-radius: 0;
  }
  ol a.current {
    background-color: var(--main-background-color);
  }
  .current span {
    font-weight: bold;
  }
  ol a:hover {
    background-color: var(--rc-dark);
    color: var(--light);
  }
  ol a:focus {
    background-color: var(--rc-lighter);
    color: black;
  }
  ol li {
    list-style: none;
  }
  .ButtonRow {
    padding: 0.5rem;
    display: flex;
    justify-content: space-between;
  }
  .Creating {
    padding: 1rem;
  }
  .Creating input {
    width: 100%;
    margin: 0.5rem 0;
    border: 0.1em solid var(--rc-dark);
    padding: 0 0.25rem;
    font: inherit;
    letter-spacing: inherit;
    word-spacing: inherit;
  }
  .Creating input:focus {
    background-color: var(--rc-lighter);
  }

  .FormRow {
    padding: 0.5rem;
    display: flex;
    justify-content: space-between;
  }
  .Tags {
    margin-top: 0.5rem;
  }
  ol {
    margin: 0;
    padding: 0;
  }
  .delete {
    position: absolute;
    bottom: 0;
    right: 0;
  }
  .spacer {
    width: 24px;
  }
</style>

{#if modal}
  <h1>Collections</h1>
{:else}
  <div class="CollectionBar">
    <span class="spacer" />
    <h2>Collections</h2>
    <TextButton
      click={event => {
        creating = true;
      }}
      noClose={true}>
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
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </TextButton>
  </div>
  {#if current !== 'all' && current !== 'Recent'}
    <span class="delete">
      <TextButton
        warning={true}
        click={() => {
          deleting = true;
        }}
        noClose={true}>
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
          <polyline points="3 6 5 6 21 6" />
          <path
            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2
            2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      </TextButton>
    </span>
  {/if}
{/if}
{#if deleting}
  <form class="Deleting" on:submit={event => submitDelete(event)}>
    <div class="FormRow">
      <TextButton
        noClose={true}
        click={event => {
          deleting = false;
        }}>
        Cancel
      </TextButton>
      <Button noClose={true} warning>Delete</Button>
    </div>

    <ol class="Tags">
      {#each $collections as tag}
        <li>
          <label class:item={true} for={tag.name}>
            <input type="checkbox" id={tag.name} value={tag.name} name="tag" />
            {tag.name}
          </label>
        </li>
      {/each}
    </ol>
  </form>
{:else}
  {#if creating}
    <form class="Creating" on:submit={event => submitForm(event)}>
      <input bind:value={name} bind:this={input} />
      <div class="FormRow">
        <TextButton
          noClose={true}
          click={event => {
            creating = false;
            name = '';
          }}>
          Cancel
        </TextButton>
        <Button noClose={true}>Create Collection</Button>
      </div>
    </form>
  {/if}
  <ol>
    {#if !creating && modal}
      <li class="ButtonRow">
        <TextButton
          warning={true}
          click={() => {
            deleting = true;
          }}
          noClose={true}>
          Delete
        </TextButton>
        <Button
          click={event => {
            creating = true;
          }}
          noClose={true}>
          Create Collection
        </Button>
      </li>
    {/if}
    <li>
      <a
        class:item={true}
        href="/"
        data-close-modal
        class:current={current === 'Recent'}>
        <span class="label">Recent</span>
      </a>
    </li>
    <li>
      <a
        class:item={true}
        href="/collections/all"
        data-close-modal
        class:current={current === 'all'}>
        <span class="label">All</span>
      </a>
    </li>
  </ol>
  {#if name}
    <ol class="Tags">
      {#each $collections.filter(tag => tag.name.startsWith(name)) as tag}
        <li>
          <a
            class:item={true}
            href="/collections/{encodeURIComponent(tag.name)}"
            data-close-modal
            class:current={current === tag.name}>
            <span class="label">{tag.name}</span>
          </a>
        </li>
      {/each}
    </ol>
  {:else}
    <ol class="Tags">
      {#each $collections as tag}
        <li>
          <a
            class:item={true}
            href="/collections/{encodeURIComponent(tag.name)}"
            data-close-modal
            class:current={current === tag.name}>
            <span class="label">{tag.name}</span>
          </a>
        </li>
      {/each}
    </ol>
  {/if}
{/if}
