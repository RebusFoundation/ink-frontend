<script>
  import { stores as inkStores } from "../stores";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  const { collections, notes } = inkStores();
  let current = 'all';
  let items = []
  $: if ($collections && $notes && $notes.items) {
    items = $notes.items
  }
</script>

<style>
  .Toolbar {
    display: block;
    position: -webkit-sticky;
    position: sticky;
    top: 32px;
    left: 0;
    width: 100%;
    z-index: 2;
    line-height: 1;
    padding: 0.25rem 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 32px;
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
  label,
  select,
  option {
    font-size: 0.85rem;
  }
  select {
    display: inline-block;
    color: var(--dark);
    padding: 0.5em 2.5em 0.5em 0.5em;
    max-width: 15rem;
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
    box-shadow: 1px 2px 2px 0 rgba(133, 133, 133, 0.1);
  }
  select::-ms-expand {
    display: none;
  }
  select:hover {
    border-color: var(--rc-main);
    cursor: pointer;
  }
  @keyframes outlinePop {
    0% {
      box-shadow: 0 0 0 1px rgba(33, 33, 33, 0);
    }
    50% {
      box-shadow: 0 0 0 8px var(--rc-darker);
    }
    100% {
      box-shadow: 0 0 0 3px var(--rc-dark);
    }
  }
  select:focus {
    box-shadow: 0 0 0 3px var(--rc-dark);

    outline: solid transparent;
    animation: outlinePop 0.25s ease-in-out;
  }
  select option {
    font-weight: normal;
    text-transform: none;
  }
  .SelectLabel {
    padding: 0 0.25rem;
    font-size: 0.75rem;
    color: var(--medium);
    clip-path: inset(100%);
    clip: rect(1px, 1px, 1px, 1px);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }
  label > input {
    clip-path: inset(100%);
    clip: rect(1px, 1px, 1px, 1px);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }
  label {
    cursor: pointer;
  }
  label svg {
    padding: 4px;
    width: 24px;
    height: 24px;
  }
  input:checked + svg {
    background-color: var(--light);
    color: var(--link);
    border-radius: 0.25rem;
    box-shadow: 0 0 0 1px #ddd, 1px 2px 2px 0 rgba(133, 133, 133, 0.1);
  }
</style>

<!-- markup (zero or more items) goes here -->
<div
  class="Toolbar"
  data-no-highlight>
  <div class="Toolbar-leftbutton">
          <label>
            <span class="SelectLabel">Collection</span>
            <select
              name="viewConfig"
              id="Theme"
              on:change={event => {
                current = event.target.value
                dispatch("notes-collection", event.target.value)
              }}>
              <option value="all" 
                selected={current === 'all'}>All {#if items.length !== 0}({items.length})
                {/if}</option>
              {#each $collections as collection}
                <option value={collection.name} selected={current === collection.name}>{collection.name} {#if items.length !== 0}({items.filter(item => item.json.collection === collection.name).length})
                {/if} </option>
              {/each}
            </select>
          </label>
  </div>
  <div class="Toolbar-title">
  </div>
  <div class="Toolbar-rightbutton">
        <label>
          <input type="checkbox" value="show" checked
              on:change={event => {
                dispatch("notes-flag-filter", {filter: event.target.value, checked: event.target.checked})
              }}> 
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="square"
            stroke-linejoin="round">
            <path d="M4 17s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" y1="22" x2="4" y2="15" />
          </svg>
        </label>
        <label>
          <input type="checkbox" value="flag" checked
              on:change={event => {
                dispatch("notes-flag-filter", {filter: event.target.value, checked: event.target.checked})
              }}> 
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="square"
            stroke-linejoin="round">
            <path d="M4 17s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" y1="22" x2="4" y2="15" />
            <g transform="scale(0.475) translate(14, 10)" stroke="currentColor">
              <polyline points="20 6 9 17 4 12" stroke-width="4" />
            </g>
          </svg>
        </label>
        <label>
          <input type="checkbox" value="question" checked
              on:change={event => {
                dispatch("notes-flag-filter", {filter: event.target.value, checked: event.target.checked})
              }}> 
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
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
        </label>
        <label>
          <input type="checkbox" value="demote" checked
              on:change={event => {
                dispatch("notes-flag-filter", {filter: event.target.value, checked: event.target.checked})
              }}> 
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
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
        </label>
  </div>
</div>
