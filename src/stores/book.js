import { writable, derived } from "svelte/store";

export const infoBook = writable({});
export const currentInfoBook = writable({});

export const infoContents = derived(infoBook, ($infoBook, set) => {
  if ($infoBook.resources) {
    const toc = $infoBook.resources.find(
      item => item.rel.includes("contents") || item.rel.includes("ncx")
    );
    try {
      window
        .fetch(`/api/parse-toc?toc=${encodeURIComponent(toc.url)}`, {
          credentials: "include"
        })
        .then(response => response.json())
        .then(tocData => set(tocData));
    } catch (err) {
      set({});
      console.error(err);
    }
  } else {
    set({});
  }
});
