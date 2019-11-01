<script>
  export let item;
  export let current = false;
  export let indent = 0;
  let isCurrent = false;
  $: if (current && item.url) {
    if (item.url.includes(new URL(current, window.location).pathname)) {
      isCurrent = true;
    } else {
      isCurrent = false;
    }
  }
</script>

<style>
  li {
    counter-increment: contents;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li > a:before,
  li > span:before {
    content: counters(contents, ".") ". ";
  }
  li > ol {
    counter-reset: contents;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  [data-indent="1"] a,
  [data-indent="1"] span {
    padding-left: 1rem;
  }
  [data-indent="2"] a,
  [data-indent="2"] span {
    padding-left: 2rem;
  }
  [data-indent="3"] a,
  [data-indent="3"] span {
    padding-left: 3rem;
  }
  [data-indent="4"] a,
  [data-indent="4"] span {
    padding-left: 4rem;
  }
  a {
    text-decoration: none;
    display: block;
    padding: 0.25rem 1rem;
    border-radius: 0;
    margin-left: -1px;
  }
  a:hover {
    background-color: var(--hover);
    color: var(--light);
  }
  a:focus {
    background-color: var(--rc-lighter);
    color: black;
  }
  .current {
    background-color: var(--main-background-color);
    color: var(--link);
  }
  :global(.BookContents.modal) .current {
    background-color: #f7f7f7;
  }
</style>

<li data-indent={indent}>
  {#if item.url && isCurrent}
    <a href={item.url} class:current={isCurrent} aria-current="page">{item.label}</a>
  {:else if item.url}
    <a href={item.url}>{item.label}</a>
  {:else}
    <span>{item.label}</span>
  {/if}
  {#if item.children}
    <ol>
      {#each item.children as child}
        <svelte:self item={child} {current} indent={indent + 1} />
      {/each}
    </ol>
  {/if}
</li>
