<script>
  export let tag;
  export let tags;
  export let handleCollection;
  $: console.log(tag, tags, handleCollection);
</script>

<style>
  label {
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0.25rem 1rem;
  }
  label:hover {
    background-color: var(--hover);
    color: var(--light);
    cursor: pointer;
  }

  @supports (-webkit-appearance: none) {
    input[type="checkbox"] {
      -webkit-appearance: none;
      width: 1.6rem;
      height: 1.6rem;
      border: 1px solid #808080;
      border-radius: 0.25rem;
      margin-right: 0.5rem;
    }
    input[type="checkbox"]:focus {
      border: 1px solid var(--rc-darker, #ccc);
    }
    input[type="checkbox"]:checked {
      position: relative;
      background: none;
      border-color: white;
      background: var(--rc-darker);
    }
    input[type="checkbox"]:checked::after {
      position: absolute;
      top: 0.36rem;
      left: 0.12rem;
      content: "";
      width: 1rem;
      height: 0.3rem;
      border: 2px solid white;
      border-right: none;
      border-top: none;
      transform: rotate(-45deg);
    }
  }
</style>

<label>
  <input
    type="checkbox"
    value={tag.name}
    checked={tags.includes(tag.id)}
    id={tag.name}
    on:change={event => handleCollection(tag, event.target)} />
  {tag.name}
</label>
