<script>
  import Toolbar from "./Toolbar.svelte";
  import { open } from "../actions/modal.js";
  export let title;
  export let leftModal;
  export let rightModal;
  export let rightLabel;
  let width = 0;
  let sidebar = true;
  let sidebargrid = true;
  let rightsidebar = true;
  let showRightSidebar = true;
  let openInModal;
</script>

<style>
  .RightSidebar {
    display: none;
  }
  .Sidebar {
    display: none;
    background-color: var(--sidebar-background-color);
  }
  .center {
    box-shadow: 0px 0px 2px 0px rgba(33, 33, 33, 0.1);
    z-index: 1;
  }
  @media (min-width: 1024px) {
    .Main.sidebar {
      display: grid;
      grid-template-columns: 1fr minmax(min-content, 1fr);
      grid-template-areas:
        "body right-sidebar"
        "body right-sidebar";
    }
    .center {
      grid-area: body;
      min-height: 100vh;
    }
    .RightSidebar {
      display: block;
      height: 100vh;
      position: sticky;
      top: 0px;
      grid-area: right-sidebar;
      padding: 0;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      background-color: var(--sidebar-background-color);
    }
  }
  @media (min-width: 1281px) {
    .Main.right-sidebar {
      display: grid;
      grid-template-columns: minmax(min-content, 0.5fr) 1fr minmax(
          min-content,
          0.75fr
        );
      grid-template-areas:
        "sidebar body right-sidebar"
        "sidebar body right-sidebar";
    }
    .center {
      grid-area: body;
      min-height: 100vh;
    }
    .Sidebar {
      display: block;
      height: 100vh;
      position: sticky;
      top: 0px;
      grid-area: sidebar;
      padding: 0;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
  }
  :global(.reader) .RightSidebar {
    background-color: var(--reader-sidebar-background);
    background-color: var(--sidebar-background-color);
  }
  .SignOut {
    position: absolute;
    bottom: 0.5rem;
    left: 0.5rem;
    text-transform: uppercase;
    font-size: 0.75rem;
    text-decoration: none;
  }
</style>

<svelte:window bind:innerWidth={width} />
<div
  class="Main"
  class:sidebar={sidebargrid}
  class:right-sidebar={rightsidebar}
  class:show-right-sidebar={showRightSidebar}>
  {#if sidebar}
    <div class="Sidebar" data-no-highlight>
      <slot name="left-sidebar">
        <!-- optional fallback -->
      </slot>
      <a href="/logout" class="SignOut">Sign Out</a>
    </div>
  {/if}
  <div class="center">

    <Toolbar scrollTop={true}>
      <span slot="left-button">
        {#if width <= 1281}
          <a use:open={{ id: leftModal }} href="/" class="Toolbar-link">
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
        {:else}
          <button
            on:click={() => {
              sidebar = !sidebar;
              sidebargrid = !sidebargrid;
            }}
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
          </button>
        {/if}
      </span>
      <span slot="toolbar-title">{title}</span>
      <span slot="right-button">
        {#if width <= 1024 && rightModal}
          <a use:open={{ id: rightModal }} href="/" class="Toolbar-link">
            {rightLabel}
          </a>
        {:else}
          <button
            on:click={() => {
              rightsidebar = !rightsidebar;
              showRightSidebar = !showRightSidebar;
            }}
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
              <rect x="3" y="3" width="18" height="18" rx="1" />
              <path d="M15 3v18" />
            </svg>
          </button>
        {/if}
      </span>
    </Toolbar>

    <slot />
  </div>
  {#if showRightSidebar}
    <div class="RightSidebar" data-no-highlight>
      <slot name="right-sidebar">
        <!-- optional fallback -->
      </slot>
    </div>
  {/if}
</div>
