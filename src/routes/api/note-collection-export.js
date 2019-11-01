import got from "got";
import slugify from "slugify";
import TurndownService from 'turndown';
import {gfm} from 'turndown-plugin-gfm';
const turndownService = new TurndownService({headingStyle: "atx"});
turndownService.use(gfm)
turndownService.remove(['title', 'style'])
turndownService.keep(['svg', 'math'])
// import * as fs from "fs";

const PAGELENGTH = 25

export async function get(req, res, next) {
  if (req.user) {
    const { collection = "all", markdown = false, orderBy = "published", reverse = "false" } = req.query;
    try {
      const notesEndpoint = `${req.user.profile.id}/notes`;
      const url = new URL(`${notesEndpoint}?limit=${PAGELENGTH}&page=1&orderBy=${orderBy}&reverse=${reverse}`, process.env.API_SERVER);
      const response = await got.get(url.href, {
        headers: {
          Authorization: `Bearer ${req.user.token}`
        },
        json: true
      });
      const totalItems = response.body.totalItems
      if (collection && collection !== "all") {
        response.body.items = response.body.items.filter(item => item.json.collection === collection)
      }
      let notes = [renderNotes(response.body)]
      const pages = Math.ceil(totalItems / PAGELENGTH);
      for (let page = 1; page <= pages; page++) {
        notes = notes.concat(getAndRenderNotes(req, page))
      }
      const renderedNotes = await Promise.all(notes)
      const html = renderHTML(renderedNotes.join('\n'), collection)
      if (!markdown) {
        res.set('Content-Disposition', `attachment; filename="${slugify(collection)}-notes.html"`)
        return res.send(html);
      } else {
        res.type('text/plain')
        res.set('Content-Disposition', `attachment; filename="${slugify(collection)}-notes.md"`)
        return res.send(turndownService.turndown(html));
      }
    } catch (err) {
      console.log(err);
      return res.sendStatus(err.statusCode || 500);
    }
  }
}

async function getAndRenderNotes (req, page) {
    const { collection = "all", orderBy = "published", reverse = "false" } = req.query;
    const notesEndpoint = `${req.user.profile.id}/notes`;
    const url = new URL(
      `${notesEndpoint}?limit=${PAGELENGTH}&page=${page + 1}&orderBy=${orderBy}&reverse=${reverse}`,
      process.env.API_SERVER
    );
    const response = await got.get(url.href, {
      headers: {
        Authorization: `Bearer ${req.user.token}`
      },
      json: true
    });
    if (collection && collection !== "all") {
      response.body.items = response.body.items.filter(item => item.json.collection === collection)
    }
    return renderNotes(response.body)
}

function renderNotes ({items}) {
  const htmlNotes = items.map(item => {
    return `<div class="Note" data-label="${item.json.label}">
    <h2>${item.publication.name}</h2>
      ${item.content}
    <div class="Content ${item.json.comment ? "Commented": "Empty"}">${item.json.comment || ""}</div>
    ${item.json.collection ? `<div class="Collection">${item.json.collection}</div>` : ""}
  </div>`
  })
  if (items.length > 0) {
    return `
    <div class="Chapter">
      ${htmlNotes.join('\n')}
    </div>
    `
  } else {
    return ''
  }
}

function renderHTML  (notes, collection) {
  return `<!doctype html>
  <html>
  <head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width,initial-scale=1.0'>
    <title>Notes ${collection ? `in ${collection}` : "" }</title>

    <style>
    
:root {
  --rc-darker: #2e9595;
  --rc-dark: #32a5a5;
  --rc-main: #37b5b5;
  --rc-medium: #6dc9c9;
  --rc-light: #b8f4f2;
  --rc-lighter: #e4fffe;
  --sidebar-background-color: #f3f7fa;
  --main-background-color: #fefefe;
  --warm-background-color: #f7f6f4;
  --highlight-color: #ffff98;
  --dark: #333333;
  --medium: #555555;
  --light: #fafafa;
  --link: #2e9595;
  --hover: #6dc9c9;
  --active: #00ccee;
  --primary: #cd4b18;
  --visited: #2e9595;
  --error: #ff3b3b;
  --error-light: #fff5f4;
  --valid: #2ed0ac;
  --valid-light: #eefffc;
  --warning: #ffd943;
  --warning-light: #fffbef;
  --disabled: #c6c6c6;
  --button-background-color: #f9f9f9;
  --reader-sidebar-background: #ffffff;
}
:root {
  --reader-font-size: 1.4rem;
  --reader-paragraph-spacing: 1rem;
  --reader-left-margin: 2.5rem;
  --reader-text-color: #000;
  --reader-min-column-width: 12rem;
  --reader-max-column-width: 36rem;
  --reader-background-color: white;
  --reader-border-color: #fafaef;
  --reader-line-height: 1.45;
  --reader-font-family: var(--old-style-fonts);
}
@media (max-width: 820px) {
  :root {
    --reader-font-size: 1rem;
    --reader-paragraph-spacing: 1rem;
    --reader-left-margin: 2rem;
  }
}
@media (max-width: 550px) {
  :root {
    --reader-font-size: 1rem;
    --reader-paragraph-spacing: 0.85rem;
    --reader-left-margin: 2rem;
  }
}

:root {
  --xx-small: 0.6rem;
  --x-small: 0.7rem;
  --small: 0.85rem;
  --regular: 1rem;
  --bigger: 1.1rem;
  --large: 1.25rem;
  --x-large: 1.5rem;
  --xx-large: 1.75rem;
}


:root {
  --sans-fonts: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen-Sans, Ubuntu, Cantrell, "Helvetica Neue", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  --fonts: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen-Sans, Ubuntu, Cantrell, "Helvetica Neue", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  --old-style-fonts: "Iowan Old Style", "Sitka Text", Palatino, "Book Antiqua",
    serif;
  --modern-serif-fonts: Athelas, Constantia, Georgia, serif;
  --neutral-fonts: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI",
    Roboto, Noto, "Helvetica Neue", Arial, sans-serif;
  --humanist-sans-fonts: Seravek, Calibri, Roboto, Arial, sans-serif;
  --monospace-fonts: "Andale Mono", Consolas, monospace;
  --duo-accessible-fonts: Duo, sans-serif;
  --font-size: 125%;
  --line-height: 1.5;
  --border-radius: 4px;
}
.Collection {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #666;
}
  .Chapter > * {
    grid-column: 2 / 3;
    margin: 0 auto;
    max-width: 100%;
  }
  .Bookmarked {
    position: relative;
  }
  .Bookmarked::after {
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

  .Chapter .Highlight {
    background-color: #ffff98;
  }

  .Chapter .Highlight--selected {
    background-color: #ddddd0;
  }

  .Chapter [hidden],
  .Chapter template {
    display: none !important;
  }
  .Chapter head {
    display: none;
  }

  .Chapter blockquote {
    padding-left: 2.5em;
    margin-left: 0;
  }

  .Chapter blockquote,
  .Chapter blockquote p {
    font-size: 0.75rem;
    font-size: calc(var(--reader-font-size) * 0.85);
    line-height: 1.45;
  }

  .Chapter blockquote * + * {
    margin-top: calc(var(--reader-paragraph-spacing) * 0.85);
  }
  .Chapter blockquote * {
    margin-bottom: 0;
  }
  .Chapter blockquote :first-child {
    margin: 0;
  }
  .Chapter h1 {
    font-size: 2em;
    font-size: calc(var(--reader-font-size) * 3);
    font-weight: 600;
    margin: 0;
  }

  .Chapter h2 {
    font-weight: 600;
    font-size: calc(var(--reader-font-size) * 2);
    margin: 0;
  }
  .Chapter h3 {
    font-weight: 400;
    font-style: italic;
    font-size: calc(var(--reader-font-size) * 1.5);
    margin: 0;
  }
  .Chapter h4 {
    font-weight: normal;
    font-size: calc(var(--reader-font-size) * 1.25);
    margin: 0;
  }
  .Chapter h5 {
    font-weight: normal;
    font-size: var(--reader-font-size);
    text-transform: uppercase;
    margin: 0;
  }

  .Chapter h6 {
    font-weight: normal;
    font-size: var(--reader-font-size);
    margin: 0;
  }

  .Chapter h1,
  .Chapter h2,
  .Chapter h3,
  .Chapter h4,
  .Chapter h5,
  .Chapter h6 {
    margin: 0;
  }

  .Chapter p,
  .Chapter td,
  .Chapter figure,
  .Chapter figcaption {
    line-height: var(--reader-line-height);
    font-size: 0.85rem;
    font-size: var(--reader-font-size, 0.85rem);
  }

  .Chapter a[href] {
    transition: box-shadow 0.1s cubic-bezier(0.9, 0.03, 0.69, 0.22),
      transform 0.1s cubic-bezier(0.9, 0.03, 0.69, 0.22);
    text-decoration: underline;
  }
  .Chapter :link {
    color: var(--link);
  }
  .Chapter :visited {
    color: var(--visited);
  }
  .Chapter a:link:hover {
    color: var(--hover);
  }
  .Chapter a {
    border-radius: 0;
  }
  .Highlight.Commented {
    position: relative;
    border-bottom: 0.125rem solid #eded00;
  }
  .Chapter a.Highlight, .Chapter mark.Highlight {
    background-color: #feff9c;
    color: var(--reader-text-color);
    text-decoration: none;
    border-radius: 0;
    position: relative;
  }
  .Chapter .Highlight[data-highlight-label="question"] {
    background-color: var(--rc-lighter);
  }
  .Chapter mark.Highlight[data-highlight-level="1"] {
    background-color: #7afcff;
  }
  .Chapter mark.Highlight[data-highlight-level="2"] {
    background-color: #ff65a3;
  }
  .Chapter mark.Highlight[data-highlight-level="3"] {
    background-color: #fff740;
  }
  .Chapter a.Highlight:hover {
    background-color: var(--rc-lighter);
    box-shadow: 0 0 0 3px var(--rc-lighter);
    color: var(--reader-text-color);
    text-decoration: none;
    border-radius: 0;
    cursor: pointer;
  }
  .Highlight-anchor {
    clip-path: inset(100%);
    clip: rect(1px, 1px, 1px, 1px);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
    top: -40px;
    left: 0;
  }
  .Chapter .Highlight-return-link {
    line-height: 16px;
    height: 20px;
    width: 20px;
    border-radius: 20px;
    padding-top: 2px;
    display: inline-block;
    padding: 2px 0 0 0;
    margin: 0;
    vertical-align: middle;
    text-align: center;
    background-color: #f7f7f7;
  }
  .Chapter mark::before, 
  .Chapter mark::after, .Chapter a.Highlight::before, 
  .Chapter a.Highlight::after {
    clip-path: inset(100%);
    clip: rect(1px, 1px, 1px, 1px);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }

  .Chapter mark::before, .Chapter a.Highlight::before {
    content: " [highlight start] ";
  }

  .Chapter mark::after, .Chapter a.Highlight::after {
    content: " [highlight end] ";
  }
  .Chapter a:focus {
    background-color: var(--rc-lighter);
    box-shadow: 0 0 0 5px var(--rc-lighter);
    outline: solid transparent;
    animation: readableChapterPop 0.25s ease-in-out;
  }

  .Chapter a:link:active {
    color: var(--active);
  }
  .Chapter b,
  .Chapter strong,
  .Chapter b > *,
  .Chapter strong > * {
    font-weight: 600;
  }
  .Chapter svg,
  .Chapter img {
    max-height: 88vh;
    width: auto;
    height: auto;
    max-width: 100%;
  }
  .Chapter .is-current {
    background-color: #f9f9f9;
    box-shadow: 0 0 0 0.25rem #f9f9f9;
  }
  p, ol, ul, dl, blockquote, figure, table, hr, section, article, details, figcaption {
    margin-top: var(--reader-paragraph-spacing);
    margin-bottom: var(--reader-paragraph-spacing);
  }
  body {
  	display: grid;
	grid-template-columns: 0.5fr 1fr 0.5fr;
	font-size: 110%;
	}
body > * {
grid-column: 2 / 3;
}
.Note {
	background-color: #fefefe;
	padding: 1rem 0.5rem;
	margin-bottom: 1rem;
    z-index: 1;
    position: relative;
    box-shadow: 0px 0px 2px 0px rgba(33, 33, 33, 0.1), 1px 1px 3px 0px rgba(133, 133, 133, 0.1);
}

.Commented {
	display: block;
	font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen-Sans, Ubuntu, Cantrell, "Helvetica Neue", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    font-size: 1rem;
    margin: 1rem 0;
    padding: 0.5rem 1.5rem;box-shadow: 1px 2px 2px 0
    rgba(133, 133, 133, 0.1);
    z-index: 1;
    background-color: white;
    border-left: 0.25rem solid #eded00;
    outline: 1px solid #f0f0f0;
	}
	.Commented > p {
    font-size: 1rem;
	
    }
    .Chapter h2 {
      margin: 1rem 0;
      padding: 0 3rem;
      font-size: 1rem;
      text-transform: uppercase;
      font-weight: normal;
      text-align: right;
    }
     h1 {
    margin: 3rem 0;
    font-size: 4rem;
    font-style: italic;
    font-weight: normal;
    }
    [data-label="flag"] {
      background-color: #feff9c;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='square' stroke-linejoin='round'%3E%3Cpath d='M4 17s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z' /%3E%3Cline x1='4' y1='22' x2='4' y2='15' /%3E%3Cg transform='scale(0.475) translate(14, 10)' stroke='currentColor'%3E%3Cpolyline points='20 6 9 17 4 12' stroke-width='4' /%3E%3C/g%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: 98% 2rem;
  }[data-label="question"] {
    background-color: var(--rc-lighter);

    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='square' stroke-linejoin='round'%3E%3Cpath d='M4 17s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z' /%3E%3Cline x1='4' y1='22' x2='4' y2='15' /%3E%3Cg transform='scale(0.65) translate(6, 3)' stroke='currentColor'%3E%3Cpath d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' stroke-width='3' /%3E%3Cline x1='12' y1='17' x2='12' y2='17' stroke-width='3' /%3E%3C/g%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: 98% 2rem;
}
[data-label="demote"] {
  display: none;
}
    </style>
  </head>
  <body id="body">
  <h1>Notes ${collection ? `in <em>${collection}</em>` : "" }</h1>
  ${notes}
  </body>
  </html>
  `
}
