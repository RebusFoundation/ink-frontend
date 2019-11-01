<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  let label = "show";
  export let noteLabel;
  $: if (noteLabel) {
    label = noteLabel;
  }
</script>

<style>
  /* your styles go here */
  details {
    position: relative;
    top: 0;
    right: 0;
    margin: 0;
    padding: 0.25rem 0;
  }
  summary {
    cursor: pointer;
    list-style: none;
    text-align: center;
  }
  :global(details[open]) {
    background-color: #eee;
    border-radius: 0.25rem 0.25rem 0 0;
  }
  summary::-webkit-details-marker {
    display: none;
  }
  details-menu {
    display: flex;
    position: absolute;
    top: 100%;
    right: 0;
    max-width: 200px;
    flex-direction: column;
    z-index: 2;
    background-color: #eee;
    padding: 1rem 0;
    border-radius: 0.5rem 0 0.5rem 0.5rem;
    z-index: 3;
    grid-column: 3 / 4;
  }
  .Button {
    font-family: var(--sans-fonts);
    font-weight: 400;
    flex: 0 1 auto;
    line-height: 1.2;

    display: inline-block;
    padding: 0;
    margin: 0;

    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    text-align: center;
    white-space: nowrap;
    text-decoration: none;

    color: var(--link);
    border: none;
    background-color: transparent;

    -ms-touch-action: manipulation;
    touch-action: manipulation;
    text-transform: uppercase;
    font-size: 0.65rem;
    border-radius: 0.1rem;
    display: flex;
    align-items: center;
    justify-content: left;
    padding: 0.25rem 0.5rem;
  }
  .Button:hover {
    color: var(--hover);
    text-decoration: none;
    box-shadow: none;
    background-color: var(--main-background-color);
  }

  .Button:active {
    color: white;
    background-color: var(--rc-dark);
  }

  .Button:focus {
    box-shadow: 0 0 0 3px var(--rc-medium);
  }

  .Button:focus {
    outline: solid transparent;
  }
  .Button > span {
    justify-self: start;
  }
</style>

<details>
  <summary>
    <span data-menu-button>
      {#if label === 'show'}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#666"
          stroke-width="2"
          stroke-linecap="square"
          stroke-linejoin="round">
          <path d="M4 17s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" y1="22" x2="4" y2="15" />
        </svg>
      {:else if label === 'flag'}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#666"
          stroke-width="2"
          stroke-linecap="square"
          stroke-linejoin="round">
          <path d="M4 17s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" y1="22" x2="4" y2="15" />
          <g transform="scale(0.475) translate(14, 10)" stroke="currentColor">
            <polyline points="20 6 9 17 4 12" stroke-width="4" />
          </g>
        </svg>
      {:else if label === 'question'}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#666"
          stroke-width="2"
          stroke-linecap="square"
          stroke-linejoin="round">
          <path d="M4 17s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" y1="22" x2="4" y2="15" />
          <g transform="scale(0.65) translate(6, 3)" stroke="currentColor">
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke-width="3" />
            <line x1="12" y1="17" x2="12" y2="17" stroke-width="3" />
          </g>
        </svg>
      {:else}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#666"
          stroke-width="2"
          stroke-linecap="square"
          stroke-linejoin="round">
          <path d="M4 17s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" y1="22" x2="4" y2="15" />
          <g transform="rotate(5) translate(0, -1)" stroke="currentColor">
            <line x1="9" y1="13" x2="16" y2="7" />
            <line x1="9" y1="7" x2="16" y2="13" />
          </g>
        </svg>
      {/if}
    </span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#32A5A5"
      stroke-width="2"
      stroke-linecap="square"
      stroke-linejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  </summary>
  <details-menu role="menu">
    <button
      class="Button"
      type="button"
      role="menuitem"
      on:click={event => {
        label = "show"
        dispatch("label-change", { label: 'show' });
      }}>
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#666"
          stroke-width="2"
          stroke-linecap="square"
          stroke-linejoin="round">
          <path d="M4 17s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" y1="22" x2="4" y2="15" />
        </svg>
      </span>
      Show
    </button>
    <button
      class="Button"
      type="button"
      role="menuitem"
      on:click={event => {
        label = "flag"
        dispatch("label-change", { label: 'flag' });
      }}>
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#666"
          stroke-width="2"
          stroke-linecap="square"
          stroke-linejoin="round">
          <path d="M4 17s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" y1="22" x2="4" y2="15" />
          <g transform="scale(0.475) translate(14, 10)" stroke="currentColor">
            <polyline points="20 6 9 17 4 12" stroke-width="4" />
          </g>
        </svg>
      </span>
      Flag
    </button>
    <button
      class="Button"
      type="button"
      role="menuitem"
      on:click={event => {
        label = "question"
        dispatch("label-change", { label: 'question' });
      }}>
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#666"
          stroke-width="2"
          stroke-linecap="square"
          stroke-linejoin="round">
          <path d="M4 17s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" y1="22" x2="4" y2="15" />
          <g transform="scale(0.65) translate(6, 3)" stroke="currentColor">
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke-width="3" />
            <line x1="12" y1="17" x2="12" y2="17" stroke-width="3" />
          </g>
        </svg>
      </span>
      Question
    </button>
    <button
      class="Button"
      type="button"
      role="menuitem"
      on:click={event => {
        label = "demote"
        dispatch("label-change", { label: 'demote' });
      }}>
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#666"
          stroke-width="2"
          stroke-linecap="square"
          stroke-linejoin="round">
          <path d="M4 17s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" y1="22" x2="4" y2="15" />
          <g transform="rotate(5) translate(0, -1)" stroke="currentColor">
            <line x1="9" y1="13" x2="16" y2="7" />
            <line x1="9" y1="7" x2="16" y2="13" />
          </g>
        </svg>
      </span>
      Demote
    </button>
  </details-menu>
</details>
