<script>
  // your script goes here
  import { open } from "../actions/modal.js";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let current;
  export let chapters;
  export let width;
  let scroll;
  let height;
</script>

<style>
  svg {
    width: 12px;
    height: 12px;
    fill: #999;
  }
  .current {
    fill: var(--rc-darker);
  }

  .Toolbar-link.Progress {
    position: sticky;
    top: 40px;
    width: 24px;
    display: flex;
    flex-direction: column;
    padding: 0.25rem;
    align-items: center;
    z-index: 1;
  }
  @media (min-width: 1024px) {
    .Progress {
      left: calc(var(--reader-sidebar-width, 0px) + 13px);
    }
  }
</style>

<div>
  {#if width <= 1024}
    <div class="Toolbar-link Progress">
      {#if chapters}
        {#each chapters as chapter, i}
          <!-- content here -->
          {#if i === current}
            <svg class="current">
              <circle cx="6" cy="6" r="3" />
            </svg>
          {:else}
            <svg>
              <circle cx="6" cy="6" r="2" />
            </svg>
          {/if}
        {/each}
      {/if}
    </div>
  {:else}
    <div class="Toolbar-link Progress">
      {#if chapters}
        {#each chapters as chapter, i}
          <!-- content here -->
          {#if i === current}
            <svg class="current">
              <circle cx="6" cy="6" r="3" />
            </svg>
          {:else}
            <svg>
              <circle cx="6" cy="6" r="2" />
            </svg>
          {/if}
        {/each}
      {/if}
    </div>
  {/if}

</div>
