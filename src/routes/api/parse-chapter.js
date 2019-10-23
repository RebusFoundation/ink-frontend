import got from "got";
import { encode } from "universal-base64url";
// import * as fs from "fs";
import { chapterToJSON } from "../../api/chapter-to-json";

export async function get(req, res, next) {
  if (req.user) {
    const file = req.query.chapter;
    const index = req.query.index;
    try {
      const url = new URL(file, process.env.API_SERVER);
      if (req.firebase) {
        const bucket = req.firebase.storage().bucket();
        const file = bucket.file(encode(url.href))
        const exists = await file.exists()
        if (exists[0]) {
          res.type("json");
          file.createReadStream()
            .on("error", err => console.error(err))
            .pipe(res);
        } else {
          const redirect = await got.head(url.href, {
            followRedirect: false,
            headers: {
              Authorization: `Bearer ${req.user.token}`
            }
          });
          let body;
          let contentType;
          if (redirect.headers.location && redirect.statusCode === 302) {
            const response = await got.get(redirect.headers.location, {
              json: false
            });
            body = await response.body;
            // await fs.promises.writeFile(
            //   "test.xhtml",
            //   body
            // );
            contentType = response.headers["content-type"];
          } else {
            res.sendStatus(404);
          }
          const chapter = await chapterToJSON(body, url.href, contentType, index);
          await file.save(JSON.stringify(chapter), {
            metadata: {
              contentType: 'image/jpeg'
            }, resumable: false});
          return res.json(chapter);
        }
      }
    } catch (err) {
      console.error(err);
      next(err);
    }
  } else {
    return res.sendStatus(403);
  }
}
