import got from "got";
// import * as fs from "fs";
import { chapterToJSON } from "../../api/chapter-to-json";

export async function get(req, res, next) {
  if (req.user) {
    const file = req.query.chapter;
    const index = req.query.index;
    try {
      const url = new URL(file, process.env.API_SERVER);
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
      return res.json(chapter);
    } catch (err) {
      console.error(err);
      next(err);
    }
  } else {
    return res.sendStatus(403);
  }
}
