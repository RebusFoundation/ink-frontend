<script>
  export let id;
</script>

<style>
  .Chapter {
    all: initial;
    position: relative;
    line-height: var(--reader-line-height);
    font-size: var(--reader-font-size);
    color: var(--reader-text-color);
    font-family: var(--reader-font-family);
    background-color: var(--reader-background-color);
    line-height: var(--reader-line-height);
    display: block;
    contain: content;
    padding: 0;
    display: grid;
    grid-template-columns:
      minmax(var(--reader-left-margin), 1fr) minmax(
        var(--reader-min-column-width),
        var(--reader-max-column-width)
      )
      minmax(var(--reader-left-margin), 1fr);
    grid-template-areas: "leftmargin maintext rightmargin";
    grid-row-gap: var(--reader-paragraph-spacing);
    min-height: 100vh;
  }
  /* .ChapterNotes {
    grid-area: rightmargin;
    margin-left: var(--reader-left-margin);
    background-color: #fefefe;
  } */
  :global(.Chapter > *) {
    grid-column: 2 / 3;
    margin: 0 auto;
    max-width: 100%;
  }
  :global(.Bookmarked) {
    position: relative;
  }
  :global(.Bookmarked)::after {
    content: "";
    position: absolute;
    left: 50%;
    margin-left: -50vw;
    display: block;
    top: 0;
    height: 2.5rem;
    border-left: 0.75rem solid #b4312e;
    border-bottom: 0.75rem solid transparent;
  }
  /* :global(.Highlight.Commented)::after {
    content: "";
    position: absolute;
    left: 50%;
    margin-left: -50vw;
    display: block;
    top: 0;
    height: 1.25rem;
    border-left: 1.25rem solid #b4312e;
    border-bottom: 0.75rem solid transparent;
  } */

  :global(.Chapter [hidden]),
  :global(.Chapter template) {
    display: none !important;
  }
  :global(.Chapter head) {
    display: none;
  }

  :global(.Chapter blockquote) {
    margin-left: 2.5em;
  }

  :global(.Chapter blockquote),
  :global(.Chapter blockquote p) {
    font-size: 0.75rem;
    font-size: calc(var(--reader-font-size) * 0.85);
    line-height: 1.2;
  }

  :global(.Chapter blockquote * + *) {
    margin-top: calc(var(--reader-paragraph-spacing) * 0.85);
  }
  :global(.Chapter blockquote *) {
    margin-bottom: 0;
  }
  :global(.Chapter blockquote :first-child) {
    margin: 0;
  }
  :global(.Chapter h1) {
    font-size: 2em;
    font-size: calc(var(--reader-font-size) * 3);
    font-weight: 600;
    margin: 0;
  }

  :global(.Chapter h2) {
    font-weight: 600;
    font-size: calc(var(--reader-font-size) * 2);
    margin: 0;
  }
  :global(.Chapter h3) {
    font-weight: 400;
    font-style: italic;
    font-size: calc(var(--reader-font-size) * 1.5);
    margin: 0;
  }
  :global(.Chapter h4) {
    font-weight: normal;
    font-size: calc(var(--reader-font-size) * 1.25);
    margin: 0;
  }
  :global(.Chapter h5) {
    font-weight: normal;
    font-size: var(--reader-font-size);
    text-transform: uppercase;
    margin: 0;
  }

  :global(.Chapter h6) {
    font-weight: normal;
    font-size: var(--reader-font-size);
    margin: 0;
  }

  :global(.Chapter h1),
  :global(.Chapter h2),
  :global(.Chapter h3),
  :global(.Chapter h4),
  :global(.Chapter h5),
  :global(.Chapter h6) {
    margin: 0;
  }

  :global(.Chapter p),
  :global(.Chapter td),
  :global(.Chapter figure),
  :global(.Chapter figcaption) {
    line-height: var(--reader-line-height);
    font-size: 0.85rem;
    font-size: var(--reader-font-size, 0.85rem);
  }

  :global(.Chapter a[href]) {
    transition: box-shadow 0.1s cubic-bezier(0.9, 0.03, 0.69, 0.22),
      transform 0.1s cubic-bezier(0.9, 0.03, 0.69, 0.22);
    text-decoration: underline;
  }
  :global(.Chapter :link) {
    color: var(--link);
  }
  :global(.Chapter :visited) {
    color: var(--visited);
  }
  :global(.Chapter a:link:hover) {
    color: var(--hover);
  }
  :global(.Chapter a) {
    border-radius: 0;
  }

  :global(.Highlight.Commented) {
    position: relative;
    border-bottom: 0.125rem solid #eded00;
  }
  :global(.Chapter a.Highlight),
  :global(.Chapter mark.Highlight) {
    background-color: #feff9c;
    box-shadow: 0 0 0 2px #feff9c;
    color: var(--reader-text-color);
    text-decoration: none;
    border-radius: 0;
  }
  :global(.Chapter mark.Highlight[data-highlight-level="1"]) {
    background-color: #7afcff;
    box-shadow: 0 0 0 2px #7afcff;
  }
  :global(.Chapter mark.Highlight[data-highlight-level="2"]) {
    background-color: #ff65a3;
    box-shadow: 0 0 0 2px #ff65a3;
  }
  :global(.Chapter mark.Highlight[data-highlight-level="3"]) {
    background-color: #fff740;
    box-shadow: 0 0 0 2px #fff740;
  }
  :global(.Chapter a.Highlight:hover),
  :global(.Chapter mark.Highlight:hover) {
    background-color: var(--rc-lighter);
    box-shadow: 0 0 0 3px var(--rc-lighter);
    color: var(--reader-text-color);
    text-decoration: none;
    border-radius: 0;
  }
  :global(.Chapter mark.Highlight[data-highlight-level="1"]:hover) {
    background-color: var(--rc-light);
    box-shadow: 0 0 0 3px var(--rc-light);
  }
  :global(.Chapter mark.Highlight[data-highlight-level="2"]:hover) {
    background-color: #ff7eb9;
    box-shadow: 0 0 0 3px #ff7eb9;
  }
  :global(.Chapter mark.Highlight[data-highlight-level="3"]:hover) {
    background-color: #feff9c;
    box-shadow: 0 0 0 3px #feff9c;
  }

  :global(.Chapter .Highlight--selected) {
    background-color: #ddddd0;
  }
  @keyframes readableChapterPop {
    0% {
      box-shadow: 0 0 0 1px rgb(228, 255, 254, 0.2);
      background-color: rgb(228, 255, 254, 0.2);
      transform: scale(0.5);
    }
    50% {
      box-shadow: 0 0 0 8px var(--rc-lighter);
      transform: scale(1.5);
    }
    100% {
      box-shadow: 0 0 0 3px var(--rc-lighter);
      background-color: var(--rc-lighter);
      transform: scale(1);
    }
  }
  :global(.Chapter a:focus) {
    background-color: var(--rc-lighter);
    box-shadow: 0 0 0 5px var(--rc-lighter);
    outline: solid transparent;
    animation: readableChapterPop 0.25s ease-in-out;
  }

  :global(.Chapter a:link:active) {
    color: var(--active);
  }
  :global(.Chapter b),
  :global(.Chapter strong),
  :global(.Chapter b > *),
  :global(.Chapter strong > *) {
    font-weight: 600;
  }
  :global(.Chapter svg),
  :global(.Chapter img) {
    max-height: 88vh;
    width: auto;
    height: auto;
    max-width: 100%;
  }
  :global(.Chapter .is-current) {
    background-color: #f9f9f9;
    box-shadow: 0 0 0 0.25rem #f9f9f9;
  }
  :global(p, ol, ul, dl, blockquote, figure, table, hr, section, article, details, figcaption) {
    margin-top: var(--reader-paragraph-spacing);
    margin-bottom: var(--reader-paragraph-spacing);
  }
</style>

<div class="Chapter">

  <p>
    The difficulties of classification are very apparent here, and once more it
    must be noted that illustrative and practical purposes rather than logical
    ones are served by the arrangement adopted. The modern fanciful story is
    here placed next to the
    <a href="/test" class="Highlight Commented">real folk story</a>
    instead of after all the groups of folk products. The Hebrew stories at the
    beginning belong quite as well, perhaps even better, in Section V, while the
    stories at the end of Section VI shade off into the more modern types of
    short tales. Then the fact that other groups of modern stories are to follow
    later, illustrating more realistic studies of life and the very recent and
    remarkably numerous writings centering around animal life, limits the list
    here. Many of the animal stories might, with equal propriety, be placed
    under the head of the fantastic.
  </p>
  <p>
    <span epub:type="bridgehead">The child's natural literature.</span>
    The world has lost certain secrets as the price of an advancing
    civilization. It is a commonplace of observation that no one can duplicate
    the
    <a href="/test" class="Highlight">
      success of Mother Goose, whether she be thought of as the maker of jingles
      or the teller of tales. The conditions of modern life preclude the
      generally naïve attitude
      <mark data-href="/" class="Highlight" data-highlight-level="1">
        that produced the folk rhymes, ballads, tales, proverbs, fables, and
        myths. The folk saw things simply and directly. The complex, analytic,
        questioning mind is not yet, either in or out of stories.
        <mark data-href="/" class="Highlight" data-highlight-level="2">
          The motives from which people act are to them plain and not mixed.
        </mark>
        Characters are good or bad. They feel no need of elaborately explaining
        their joys and sorrows.
      </mark>
      Such experiences come with the day's work. "To-morrow to fresh woods, and
      pastures new." The zest of life with them is emphatic.
    </a>
    Their humor is fresh, unbounded, sincere; there is no trace of cynicism. In
    folk literature we do not feel the presence of a "writer" who is mightily
    concerned about maintaining his reputation for wisdom, originality, or
    style. Hence the freedom from any note of straining after effect, of
    artificiality. In the midst of a life limited to fundamental needs, their
    literature deals with fundamentals. On the whole, it was a literature for
    entertainment. A more learned upper class may have concerned itself then
    about "problems" and "purposes," as the whole world does now, but the
    literature of the folk had no such interests.
  </p>
</div>
