<script>
  // your script goes here
  export let primary = false;
  export let disabled = null;
  export let href = false;
  export let click = () => {};
  export let hidden = false;
  export let noClose = null;
  export let close = null;
  export let warning = false;
  export let collection = false;
</script>

<style>
  /*
Button

Basic button component.

Markup:
<button class="Button {{modifier_class}}">This is a Test Button</button>

.Button:hover - hover state
.Button:focus - focus state
.Button:active - active state
.Button:active:focus - active+focus state
.Button--circular - more rounded borders
.Button--disabled - disabled state (also styles the `disabled` attribute)
.Button--primary - primary button
.Button--primary:hover - primary button, hover
.Button--primary:focus - primary button, focus
.Button--primary:active - primary button, active
.Button--primary:active:focus - primary button, active+focus

StyleGuide 6.Button

*/
  .Button,
  .Button:link {
    font-family: var(--sans-fonts);
    font-size: 0.65rem;
    flex: 0 1 auto;
    line-height: 1;

    display: inline-block;

    padding: 0.45rem 1.5rem 0.5rem;

    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    text-align: center;
    white-space: nowrap;
    text-decoration: none;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--dark);
    border-radius: var(--border-radius);
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    /* transition: box-shadow 0.15s ease-in-out; */
    background-color: var(--rc-main);
    box-shadow: 1px 2px 4px 0 rgba(33, 33, 33, 0.1);
    text-decoration: none !important;
    border: none;
  }

  .Button:hover,
  .Button:link:hover,
  .Button:link:visited:hover,
  .Button:visited:hover,
  .Button:link:visited:hover {
    color: white !important;
    background-color: var(--rc-dark);
    box-shadow: none;
    text-decoration: none;
  }

  .Button:active,
  .Button:link:active {
    background-color: var(--active);
  }

  .Button.primary,
  .Button.primary:link,
  .Button.primary:visited {
    color: white;
    font-weight: 350;
    background-color: var(--link);
    background-image: none;
  }
  .Button:focus {
    border-color: var(--link);
    outline: none;
    background-color: var(--link);
    box-shadow: rgb(255, 255, 255) 0px 0px 0px 1px, 0px 0px 0px 3px var(--link);
  }

  .Button.primary:active {
    color: white;
    border-color: var(--active);
    background-color: var(--active);
  }
  .Button.primary:hover,
  .Button.primary:link:hover,
  .Button.primary:link:visited:hover {
    color: white !important;
    background-color: var(--hover);
    border-color: var(--hover);
  }

  .Button.primary:active:focus,
  .Button.primary:active:hover {
    box-shadow: rgb(255, 255, 255) 0px 0px 0px 1px,
      0px 0px 0px 3px var(--active);
  }

  .Button[disabled],
  .Button.primary[disabled],
  .Button[disabled]:hover,
  .Button.primary[disabled]:hover {
    background-color: #eee;
    background-image: none;
    border-color: #eee;
    color: #bbb;
    cursor: not-allowed;
  }
  .Button[disabled]:focus,
  .Button.primary[disabled]:focus {
    border-color: #999;
    background-color: var(--disabled);
    box-shadow: inset 0 0px 2px 0 rgba(0, 66, 98, 0.15);
    background-image: none;
  }
  /* 
.Button--add {
  font-size: 2rem;
  line-height: 0.7rem;

  vertical-align: text-top;
}

.Button--front {
  font-size: 1.1rem;
}

.Button--remove {
  font-size: 2rem;
} */
  .Button.warning {
    background-color: var(--error);
    color: white;
  }
  .Button.collection {
    box-shadow: 0 0 0 1px #ddd, 1px 2px 2px 0 rgba(133, 133, 133, 0.1);
    background-color: #f0f0f0;
    border-radius: 16px;
  }
</style>

{#if href}
  <a
    class="Button"
    class:primary
    class:warning
    class:collection
    {hidden}
    {disabled}
    {href}
    on:click={click}
    data-no-close={noClose}
    data-close-modal={close}>
    <slot />
  </a>
{:else}
  <button
    class="Button"
    class:primary
    class:warning
    class:collection
    {hidden}
    {disabled}
    on:click={click}
    data-no-close={noClose}
    data-close-modal={close}>
    <slot />
  </button>
{/if}
