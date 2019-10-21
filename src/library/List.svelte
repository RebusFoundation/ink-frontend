<script>
  import Item from "./Item.svelte";
  import { decode, encode } from "universal-base64url";
  export let list;
  export let layout = "covers";
  export let withSidebar = false;
  export let collection = "all";
  export let current;
  $: if (list) {
    list = list.map(item => {
      if (item.resources && item.resources.data) {
        item.resources = item.resources.data;
      } else if (!item.resources) {
        item.resources = [];
      }
      const coverResource = item.resources.find(resource =>
        resource.rel.includes("cover")
      );
      if (coverResource) {
        item.cover = `/assets${
          new window.URL(coverResource.url).pathname
        }?cover=true`;
      } else {
        item.cover = "/placeholder-cover.jpg";
      }
      if (item.id) {
        const query = new window.URLSearchParams(window.location.search);
        query.set("item", encode(item.id));
        // We base64url encode the url here because a lot of CDNs have problems with urls in urls, even when properly escaped as URL components.
        item.url = `/collections/${collection}/library/?${query.toString()}`;
      }
      return item;
    });
  }
</script>

<style>
  /* your styles go here */
  .List.covers,
  .List.square,
  .List.list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(6rem, 0.5fr));
    grid-gap: 0.5rem;
    padding-bottom: 1rem;
  }
  .List.square {
    padding: 0;
    grid-gap: 1px;
    grid-auto-rows: 1fr;
    grid-template-columns: repeat(auto-fill, 6rem);
  }
  .List.list {
    padding: 0;
    grid-gap: 0;
    grid-template-columns: 1fr;
  }
</style>

<div class="List {layout}">
  {#if list}
    {#each list as item}
      <Item {layout} {current} {...item} />
    {/each}
  {/if}
</div>
