import { writable } from "svelte/store";
// import { goto } from "@sapper/app";
// import { decode, encode } from "universal-base64url";

export const modal = writable();

export let activeModal;
modal.subscribe(value => {
  activeModal = value;
});
let scroll;

// Actions
export function open(node, options) {
  const eventHandler = {
    options,
    handleEvent(event) {
      if (activeModal) return;
      event.preventDefault();
      event.stopPropagation();
      opener(this.options);
    }
  };
  node.addEventListener("click", eventHandler);
  return {
    update(props) {
      eventHandler.options = props;
    },
    destroy() {
      node.removeEventListener("click", eventHandler);
    }
  };
}
export function sidebar(node, options) {
  const eventHandler = {
    options,
    handleEvent(event) {
      // Based on https://github.com/visionmedia/page.js/blob/master/index.js
      // MIT License
      if ((event.which === null ? event.button : event.which) !== 1) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey) return;
      if (event.defaultPrevented) return;
      if (!event.target.closest('[data-open-in-modal="true"]')) {
        if (activeModal) return;
        event.preventDefault();
        event.stopPropagation();
        opener(this.options);
      }
    }
  };
  node.addEventListener("click", eventHandler);
  return {
    update(props) {
      eventHandler.options = props;
    },
    destroy() {
      node.removeEventListener("click", eventHandler);
    }
  };
}

let documentSetup;
export function setup(node, options) {
  if (!window) return;
  if (!documentSetup) {
    document.body.addEventListener("click", event => {
      if (
        activeModal &&
        !activeModal.contains(event.target) &&
        !event.target.dataset.noClose
      ) {
        closer();
      }
    });
    documentSetup = true;
  }
  node.setAttribute("aria-hidden", "true");
  node.setAttribute("hidden", "true");
  node.setAttribute("role", "dialog");
  node.setAttribute("tabIndex", "-1");
  node.addEventListener("click", click);
  node.addEventListener("keydown", keydown);
  node.dataset.modal = "true";
  return {
    destroy() {
      node.removeEventListener("click", click);
      node.removeEventListener("keydown", keydown);
    }
  };
}

function once(emitter, eventName) {
  if (!emitter) return;
  return new Promise(resolve => {
    function listener(event) {
      resolve(event);
    }
    emitter.addEventListener(eventName, listener, { once: true });
  });
}

const FOCUSABLE_ELEMENTS =
  'button:not([hidden]):not([disabled]), [href]:not([hidden]), input:not([hidden]):not([type="hidden"]):not([disabled]), select:not([hidden]):not([disabled]), textarea:not([hidden]):not([disabled]), [tabindex="0"]:not([hidden]):not([disabled]), summary:not([hidden]), [contenteditable]:not([hidden]), audio[controls]:not([hidden]), video[controls]:not([hidden])';
export function keydown(event) {
  if (activeModal) {
    if (event.keyCode === 27) closer();
    if (event.keyCode === 9) maintainFocus(event);
  }
}

function maintainFocus(event) {
  const focusableNodes = Array.from(
    activeModal.querySelectorAll(FOCUSABLE_ELEMENTS)
  );
  const focusedItemIndex = focusableNodes.indexOf(document.activeElement);
  if (focusedItemIndex === -1) {
    focusableNodes[0].focus();
    event.preventDefault();
  } else {
    if (event.shiftKey && focusedItemIndex === 0) {
      focusableNodes[focusableNodes.length - 1].focus();
      event.preventDefault();
    }

    if (!event.shiftKey && focusedItemIndex === focusableNodes.length - 1) {
      focusableNodes[0].focus();
      event.preventDefault();
    }
  }
}

export function scrollBehaviour(toggle) {
  const body = document.querySelector("body");
  switch (toggle) {
    case "enable":
      Object.assign(body.style, { overflow: "", height: "" });
      break;
    case "disable":
      Object.assign(body.style, { overflow: "hidden", height: "100vh" });
      break;
    default:
  }
}

export function click(event) {
  if (activeModal) {
    if (event.target.closest("[data-close-modal]")) {
      closer();
      if (!event.target.closest('[role="dialog"]')) {
        event.preventDefault();
      }
    }
  }
}
let activeElement;

export async function opener(props) {
  const { id } = props;
  const node = document.getElementById(id);
  if (activeModal) {
    await closer();
  }
  const heading = node.querySelector("h1, h2, h3, h4, h5, h6");
  const doc = node.querySelector('[role="document"]');
  if (props.label) {
    node.setAttribute("aria-label", props.label);
  } else if (heading) {
    heading.id = node.id + "-heading";
    node.setAttribute("aria-labelledby", heading.id);
    if (heading.hasAttribute("data-autofocus")) {
      heading.tabIndex = "-1";
    }
  }
  for (const child of node.parentElement.children) {
    if (child !== node) {
      if (child.hasAttribute("aria-hidden")) {
        child.setAttribute(
          "data-keep-hidden",
          child.getAttribute("aria-hidden")
        );
      }

      if (child.hasAttribute("inert")) {
        child.setAttribute("data-keep-inert", child.getAttribute("inert"));
      }
      child.setAttribute("inert", "true");
      child.setAttribute("aria-hidden", "true");
    }
  }
  activeElement = document.activeElement;

  scrollBehaviour("disable");
  node.setAttribute("aria-hidden", "false");
  node.removeAttribute("hidden");
  node.classList.add("is-open");
  modal.set(node);

  await once(doc, "introend");
  const autofocus =
    node.querySelector("[autofocus]") || node.querySelector("[data-autofocus]");
  let focusTarget;
  if (autofocus) {
    focusTarget = autofocus;
  } else {
    focusTarget = node;
  }
  scroll = { top: window.scrollY, left: window.scrollX };
  window.requestAnimationFrame(() => {
    focusTarget.focus();
  });
}
export async function closer() {
  if (!activeModal) return;
  const node = activeModal;
  const doc = node.querySelector('[role="document"]');
  modal.set(null);
  // doc.classList.add("is-closing");

  await once(doc, "outroend");
  // doc.classList.remove("is-closing");
  node.setAttribute("aria-hidden", "true");
  node.setAttribute("hidden", "true");

  scrollBehaviour("enable");
  node.classList.remove("is-open");
  node.parentElement.classList.remove("js-modal-open");
  for (const child of node.parentElement.children) {
    if (child !== node) {
      if (
        child.hasAttribute("aria-hidden") &&
        child.hasAttribute("data-keep-hidden")
      ) {
        child.removeAttribute("data-keep-hidden");
      } else if (child.hasAttribute("aria-hidden")) {
        child.removeAttribute("aria-hidden");
      }

      if (
        child.hasAttribute("inert") &&
        child.hasAttribute("data-keep-inert")
      ) {
        child.removeAttribute("data-keep-inert");
      } else if (child.hasAttribute("inert")) {
        child.removeAttribute("inert");
      }
    }
  }
  window.requestAnimationFrame(() => {
    if (activeElement) {
      activeElement.focus();
      window.scrollTo(scroll);
      activeElement = null;
    }
  });
}
