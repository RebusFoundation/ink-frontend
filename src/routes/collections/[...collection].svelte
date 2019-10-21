<script context="module">
  import { decode, encode } from "universal-base64url";
  export async function preload(page, session) {
    try {
      const [collection, type = "library"] = page.params.collection;
      const {
        orderBy = "datePublished",
        reverse = "false",
        layout = "list"
      } = page.query;
      let books = { items: [] };
      if (session.user) {
        books = await this.fetch(
          `/api/collections?collection=${encodeURIComponent(
            collection
          )}&page=1&orderBy=${orderBy}&reverse=${reverse}&type=${type}`,
          {
            credentials: "include"
          }
        ).then(response => response.json());
      }
      let hideLoadMore;
      if (books.totalItems === books.items.length || books.items.length === 0) {
        hideLoadMore = true;
      }
      let sidebar;
      if (page.query.item) {
        sidebar = decode(page.query.item);
      }
      return {
        items: books.items,
        collection,
        page: books.page,
        selected: `${orderBy}${reverse === "false" ? "" : "-reversed"}`,
        hideLoadMore,
        sidebar,
        layout,
        type
      };
    } catch (err) {
      console.log(err);
      return { items: [], collection, layout };
    }
  }
</script>

<script>
  import Toolbar from "../../components/Toolbar.svelte";
  import WithSidebars from "../../components/WithSidebars.svelte";
  import Collections from "../../collections/Collections.svelte";
  import Button from "../../components/Button.svelte";
  import List from "../../library/List.svelte";
  import NotesList from "../../library/NotesList.svelte";
  import CollectionTabs from "../../library/CollectionTabs.svelte";
  import InfoActions from "../../components/InfoActions.svelte";
  import * as sapper from "@sapper/app";
  import { profile } from "../_profile.js";
  import { open } from "../../actions/modal.js";
  import { stores } from "../../stores";
  import { writable } from "svelte/store";
  import { fly } from "svelte/transition";
  const { infoBook, currentInfoBook, title } = stores();
  export let items;
  export let collection;
  export let selected;
  export let page;
  export let hideLoadMore = false;
  export let layout;
  export let type;
  export let sidebar;
  $: title.set(collection);
  $: console.log(type);
  let notes;
  let library;
  const search = writable(window.location.search);
  $: if ($search) {
    notes = `/collections/${collection}/notes${$search}`;
    library = `/collections/${collection}${$search}`;
  } else {
    notes = `/collections/${collection}/notes`;
    library = `/collections/${collection}`;
  }
  let options;
  $: if (type === "library") {
    options = [
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
  } else {
    options = [
      {
        text: "Newest first",
        value: "created",
        selected: selected === "created"
      },
      {
        text: "Oldest first",
        value: "created-reversed",
        selected: selected === "created-reversed"
      },
      {
        text: "Updated first",
        value: "updated",
        selected: selected === "updated"
      },
      {
        text: "Updated last",
        value: "updated-reversed",
        selected: selected === "updated-reversed"
      }
    ];
  }

  let order = {
    orderBy: "",
    reverse: "",
    page: 1
  };
  function onSelect(event) {
    const value = event.target.value.split("-");
    const query = new window.URLSearchParams(window.location.search);
    query.set("noHistory", "true");
    if (value[0] === "datePublished") {
      query.delete("orderBy");
      query.delete("reverse");
      query.set("page", 1);
      if (value[1]) {
        query.set("orderBy", "datePublished");
        query.set("reverse", "true");
        query.set("page", 1);
      }
    } else {
      order = {
        orderBy: `?orderBy=${value[0]}`,
        reverse: "",
        page: 1
      };
      query.set("orderBy", value[0]);
      query.delete("reverse");
      query.set("page", 1);
      if (value[1]) {
        order.reverse = "&reverse=true";
        query.set("reverse", "true");
      }
    }
    search.set("?" + query.toString());
    return sapper.goto(
      `/collections/${collection}/${type}/?${query.toString()}`
    );
  }

  // Needs to update collection if $jobs has changed. Get first 10, remove those whose ID we already have, then prepend to collection.
  // Then load more needs to filter out all books we've already loaded.
  $: if (process.browser) {
    check();
  }
  async function check() {
    const endTime = Number(new Date()) + 1000 * 60 * 10;
    const interval = 1000 * 10;
    while (true) {
      try {
        await loadMore(true);
        if (Number(new Date()) < endTime) {
          await new Promise(resolve => setTimeout(resolve, interval));
        }
      } catch (err) {
        return err;
      }
    }
  }
  async function loadMore(prepend) {
    try {
      let page;
      if (prepend) {
        page = 1;
      } else {
        page = order.page + 1;
        order.page = order.page + 1;
      }
      const libraryAdditions = await window
        .fetch(
          `/api/collections?collection=${collection}&page=${page}${order.orderBy &&
            order.orderBy.slice(1)}${order.reverse}&type=${type}`,
          {
            credentials: "include"
          }
        )
        .then(response => response.json());
      const itemIds = items.map(item => item.id);
      const additions = libraryAdditions.items.filter(
        item => itemIds.indexOf(item.id) === -1
      );
      if (prepend) {
        items = additions.concat(items);
      } else {
        items = items.concat(additions);
      }
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
  .CollectionsMain {
    padding: var(--reader-left-margin);
  }

  label,
  select,
  option {
    font-size: 1em;
  }
  @media (max-width: 1100px) {
    label,
    select,
    option,
    .select {
      font-size: 13px;
    }
  }
  select {
    display: inline-block;
    color: var(--dark);
    padding: 0.5em 2.5em 0.5em 0.5em;
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
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>

<svelte:head>
  <title>{collection === 'all' ? 'All' : collection} – Rebus Ink</title>
</svelte:head>

<div
  class="CollectionsMain"
  in:fly={{ y: 200, duration: 250, delay: 250 }}
  out:fly={{ y: 200, duration: 250 }}>
  <div class="ViewConfig">
    <CollectionTabs {collection} current={type} {notes} {library} />
    <div class="select">
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
  </div>
  <!-- Recent -->
  {#if items}
    {#if type === 'library'}
      <List
        list={items}
        {layout}
        withSidebar={true}
        {collection}
        current={sidebar} />
    {:else}
      <NotesList
        notes={items}
        {collection}
        current={sidebar}
        withSidebar={true} />
    {/if}
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
