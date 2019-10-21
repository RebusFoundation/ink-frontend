<script>
  // your script goes here
  export let collection = "all";
  export let current = 0;
  export let notes;
  export let library;
  let tabs = [{ label: "Library" }, { label: "Notes" }];
</script>

<style>
  .tabs {
    display: flex;
    padding: 0;
    margin: 0;
    list-style: none;
    border-radius: 4px;
    align-items: center;
    border: 1px solid var(--rc-main);
  }
  li {
    padding: 0;
    margin: 0;
    display: inline-flex;
  }
  a {
    padding: 0.25rem 0.5rem;
    text-decoration: none;
    text-transform: uppercase;
    font-size: 0.85rem;
    margin: 0;
  }
  a.current {
    background-color: var(--sidebar-background-color);
    border-radius: 4px;
    font-weight: 600;
  }
  @media (max-width: 1100px) {
    a {
      font-size: 13px;
    }
  }
</style>

<ol class="tabs">
  {#if tabs}
    {#each tabs as tab, i}
      {#if tab.label.toLowerCase() === current}
        <li>
          <a
            href={tab.label === 'Library' ? library : notes}
            class:current={tab.label.toLowerCase() === current}
            aria-current="page">
            {tab.label}
          </a>
        </li>
      {:else}
        <li>
          <a href={tab.label === 'Library' ? library : notes}>{tab.label}</a>
        </li>
      {/if}
    {/each}
  {/if}
</ol>
