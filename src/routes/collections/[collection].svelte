<script context="module">
  export async function preload(page, session) {
    try {
      const { collection } = page.params;
      const { orderBy = "datePublished", reverse = "false" } = page.query;
      let books = { items: [] };
      if (session.user) {
        books = await this.fetch(
          `/api/collections?collection=${encodeURIComponent(
            collection
          )}&page=1&orderBy=${orderBy}&reverse=${reverse}`,
          {
            credentials: "include"
          }
        ).then(response => response.json());
      }
      let hideLoadMore;
      if (books.totalItems === books.items.length || books.items.length === 0) {
        hideLoadMore = true;
      }
      return {
        items: books.items,
        collection,
        page: books.page,
        selected: `${orderBy}${reverse === "false" ? "" : "-reversed"}`,
        hideLoadMore
      };
    } catch (err) {
      console.log(err);
      return { items: [], collection };
    }
  }
</script>

<script>
  import Toolbar from "../../components/Toolbar.svelte";
  import Button from "../../components/Button.svelte";
  import List from "../../library/List.svelte";
  import * as sapper from "@sapper/app";
  import { profile } from "../_profile.js";
  import { open } from "../../actions/modal.js";
  export let items;
  export let collection;
  export let selected;
  export let page;
  export let hideLoadMore = false;
  const options = [
    {
      text: "Newest first",
      value: "datePublished",
      selected: selected === "datePublished"
    },
    {
      text: "Oldest first",
      value: "datePublished-reversed",
      selected: selected === "datePublished-reversed"
    },
    {
      text: "A-Z",
      value: "title",
      label: "Alphabetical, ascending",
      selected: selected === "title"
    },
    {
      text: "Z-A",
      value: "title-reversed",
      label: "Alphabetical, descending",
      selected: selected === "title-reversed"
    }
  ];
  let order = {
    orderBy: "",
    reverse: "",
    page: 1
  };
  function onSelect(event) {
    const value = event.target.value.split("-");
    if (value[0] === "datePublished") {
      order = {
        orderBy: "",
        reverse: "",
        page: 1
      };
      if (value[1]) {
        order.orderBy = "?orderBy=datePublished";
        order.reverse = "&reverse=true";
      }
    } else {
      order = {
        orderBy: `?orderBy=${value[0]}`,
        reverse: "",
        page: 1
      };
      if (value[1]) {
        newOorderrder.reverse = "&reverse=true";
      }
    }
    return sapper.goto(
      `/collections/${collection}${order.orderBy}${order.reverse}`
    );
  }
  async function loadMore() {
    try {
      const libraryAdditions = await window
        .fetch(
          `/api/collections?collection=${collection}&page=${order.page +
            1}${order.orderBy && order.orderBy.slice(1)}${order.reverse}`,
          {
            credentials: "include"
          }
        )
        .then(response => response.json());
      order.page = order.page + 1;
      items = items.concat(libraryAdditions.items);
      if (libraryAdditions.done) {
        hideLoadMore = true;
      }
    } catch (err) {
      console.error(err);
    }
  }
  let collectionObserver;
  if (!collectionObserver) {
    collectionObserver = new window.IntersectionObserver(
      () => {
        if (!hideLoadMore) {
          loadMore();
        }
      },
      {
        rootMargin: "0px 0px 30px 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    );
  }
  function observe(node) {
    collectionObserver.observe(node);
    return {
      destroy() {
        collectionObserver.unobserve(node);
      }
    };
  }
</script>

<style>
  .Front {
    padding: var(--reader-left-margin);
  }

  @media (min-width: 480px) {
  }
  label,
  select,
  option {
    font-size: 1em;
  }
  select {
    display: inline-block;
    color: var(--dark);
    padding: 0.5em 2.5em 0.5em 0.5em;
    min-width: 15rem;
    max-width: 100%;
    box-sizing: border-box;
    margin: 0;
    border: 1px solid var(--rc-dark);
    border-radius: 2px;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background-color: transparent;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2332A5A5%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22square%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E"),
      linear-gradient(to bottom, transparent 0%, transparent 100%);
    background-repeat: no-repeat, repeat;
    background-position: right 0.7em top 50%, 0 0;
    background-size: 1em auto, 100%;
  }
  select::-ms-expand {
    display: none;
  }
  select:hover {
    border-color: var(--rc-main);
    cursor: pointer;
  }
  @keyframes outlinePop {
    0% {
      box-shadow: 0 0 0 1px rgba(33, 33, 33, 0);
    }
    50% {
      box-shadow: 0 0 0 8px var(--rc-darker);
    }
    100% {
      box-shadow: 0 0 0 3px var(--rc-dark);
    }
  }
  select:focus {
    box-shadow: 0 0 0 3px var(--rc-dark);

    outline: solid transparent;
    animation: outlinePop 0.25s ease-in-out;
  }
  select option {
    font-weight: normal;
    text-transform: none;
  }
  /* select[disabled] {
  background-color: var(--disabled);
  color: white;
  border-color: var(--disabled);
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23FFFFFF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22square%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E'),
    linear-gradient(to bottom, transparent 0%, transparent 100%);
} */
  .ViewConfig {
    margin: 0 auto 1rem;
    text-align: right;
  }
</style>

<svelte:head>
  <title>{collection === 'all' ? 'All' : collection} – Rebus Ink</title>
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
  </a>
  <span slot="toolbar-title">{collection}</span>
</Toolbar>
<div class="Front">
  <div class="ViewConfig">
    Ordered By
    <label>
      <select name="viewConfig" id="viewConfig" on:change={onSelect}>
        {#each options as option}
          <option
            value={option.value}
            selected={option.selected}
            aria-label={option.label || option.text}>
            {option.text}
          </option>
        {/each}
      </select>
    </label>
  </div>
  <!-- Recent -->
  {#if items}
    <List list={items} />
  {/if}
  <span class="buttonWrapper" use:observe>
    <Button
      click={async event => {
        loadMore();
      }}
      hidden={hideLoadMore}>
      Load More...
    </Button>
  </span>
</div>
