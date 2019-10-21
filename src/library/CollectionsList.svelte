<script>
  import { stores } from "../stores";
  import Button from "../components/Button.svelte";
  const { collections } = stores();
  export let recent = { items: [] };
</script>

<style>
  /* your styles go here */
  .Recent h1 {
    text-transform: uppercase;
    border-radius: 2rem;
    font-size: 1rem;
    color: var(--medium);
    margin-bottom: 1.75rem;
  }
  .Recent {
    position: relative;
  }
</style>

{#if $collections}
  <div class="Recent">
    <h1>collections</h1>
    {#each $collections as collection}
      <Button
        href="/collections/{encodeURIComponent(collection.name)}"
        collection={true}>
        {collection.name}
      </Button>
      <!-- content here -->
    {/each}
  </div>
{/if}
