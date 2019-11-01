import got from "got";
import slugify from "slugify";
// import * as fs from "fs";
export async function get(req, res, next) {
  if (req.user) {
    const notesEndpoint = `${req.user.profile.id}/notes`;
    const { page, path, title = "", chapter = "" } = req.query;
    try {
      const url = new URL(
        `${notesEndpoint}?limit=100&page=${page}&document=${path}`,
        process.env.API_SERVER
      );
      const response = await got.get(url.href, {
        headers: {
          Authorization: `Bearer ${req.user.token}`
        },
        json: true
      });
      if (response.body.items) {
        response.body.items.sort(function(first, second) {
          const start = first.json.startLocation;
          const end = second.json.startLocation;
          if (
            start === end &&
            first.json.startLocation &&
            second.json.startLocation
          ) {
            return (
              parseInt(first.json.startOffset, 10) -
              parseInt(second.json.startOffset, 10)
            );
          } else {
            return start.localeCompare(end);
          }
        });
      }
      res.set('Content-Disposition', `attachment; filename="${slugify(title)}-${slugify(chapter)}-notes.html"`)
      return res.send(renderNotes(response.body, title, chapter));
    } catch (err) {
      console.log(err);
      return res.sendStatus(err.statusCode || 500);
    }
  }
}

function renderNotes ({items}, title = "", chapter = "") {
  const htmlNotes = items.map(item => {
    return `<div class="Note">${item.content}
    <div class="Comment">${item.json.comment || ""}</div>
  </div>`
  })
  return `<!doctype html>
  <html>
  <head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width,initial-scale=1.0'>
    <title>Notes for ${title}</title>
  </head>
  <body id="body">
  <h1>Notes for ${title}</h1>
  ${chapter ? `<h2>${chapter}</h2>` : ""}
  ${htmlNotes.join('\n')}
  </body>
  </html>
  `
}
