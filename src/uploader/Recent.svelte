<script>
  import List from "../library/List.svelte";
  import Button from "../components/Button.svelte";
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
  .Recent > :global(.Button) {
    position: absolute;
    top: 0.2rem;
    right: var(--reader-left-margin);
  }
</style>

<div class="Recent">
  <h1>Recently Imported</h1>
  <Button href="/collections/all">See All</Button>
  <List list={recent.items} />
</div>
