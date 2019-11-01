<script>
  export let scrollTop = false;
  export let transparent = false;
  export let notes = false;
</script>

<style>
  .Toolbar {
    display: block;
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    background-color: var(--main-background-color);
    z-index: 2;
    line-height: 1;
    padding: 0.25rem 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 32px;
    /* box-shadow: 1px 2px 2px 0 rgba(133, 133, 133, 0.1); */
  }
  .Toolbar-link {
    font-size: 1.25rem;
    line-height: 1rem;
    cursor: pointer;
    text-align: center;
    white-space: nowrap;
    text-transform: uppercase;
    color: #32a5a5;
    color: var(--rc-dark);
  }
  .Toolbar-title,
  .Toolbar-title > :global(span) {
    text-transform: uppercase;
    font-size: 0.75rem;
    font-weight: 700;
    color: #555;
    color: var(--medium);
  }
  .Toolbar-rightbutton {
    min-width: 24px;
  }
  :global(.Toolbar .Toolbar-link) {
    font-size: 0.75rem;
    text-transform: uppercase;
    text-decoration: none;

    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    text-align: center;
    white-space: nowrap;
    text-decoration: none;
    display: inline-block;

    color: var(--link);
    border: none;
    background-color: transparent;
  }
  :global(.Toolbar .Toolbar-link:hover) {
    color: var(--hover);
  }
  :global(.Toolbar-link svg) {
    vertical-align: middle;
  }
  :global(.Toolbar-link .Label) {
    vertical-align: middle;
    font-size: 0.65rem;
  }
  .Toolbar.transparent {
    background-color: transparent;
  }
  .Toolbar.notes {
    background-color: var(--sidebar-background-color);
    box-shadow: none;
  }
</style>

<!-- markup (zero or more items) goes here -->
<nav
  class="Toolbar"
  class:transparent
  data-no-highlight
  class:notes
  on:click={() => {
    if (scrollTop) {
      window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    }
  }}>
  <slot name="left-button">
    <a href="/" class="Toolbar-link">
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
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </a>
  </slot>
  <div class="Toolbar-title">
    <slot name="toolbar-title" />
  </div>
  <div class="Toolbar-rightbutton">
    <slot name="right-button" />
  </div>
</nav>
