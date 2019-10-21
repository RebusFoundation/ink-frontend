import got from "got";
import createDOMPurify from "dompurify/dist/purify.es.js";
import { JSDOM } from "jsdom";
import * as xml from "xmlserializer";
import sharp from "sharp";

const purifyConfig = {
  KEEP_CONTENT: false,
  IN_PLACE: true,
  ADD_ATTR: ["epub:type", "xmlns:epub"],
  ADD_TAGS: ["link"],
  WHOLE_DOCUMENT: true
};

export async function get(req, res, next) {
  const { path } = req.params;
  const url = new URL(path.join("/"), process.env.API_SERVER).href;
  res.set("Cache-Control", "max-age=31536000, immutable");
  if (req.user) {
    try {
      const redirect = await got.head(url, {
        followRedirect: false,
        headers: {
          Authorization: `Bearer ${req.user.token}`
        }
      });
      let response;
      if (redirect.headers.location && redirect.statusCode === 302) {
        response = await got.head(redirect.headers.location);
      }
      if (response.headers["content-type"] === "image/svg+xml") {
        const mainresponse = await got(url);
        const dom = new JSDOM(mainresponse.body, {
          contentType: response.headers["content-type"]
        });
        const window = dom.window;
        const DOMPurify = createDOMPurify(window);
        const clean = DOMPurify.sanitize(
          window.document.documentElement,
          purifyConfig
        );
        const result = xml.serializeToString(clean);
        res.type("svg");
        res.send(result);
      } else if (
        response.headers["content-type"].includes("image") &&
        req.query.cover &&
        response.statusCode !== 404
      ) {
        const resizer = sharp()
          .resize(300, 300, { fit: "inside" })
          .jpeg({ quality: 70 });
        resizer.on("error", err => {
          console.error(err);
          res.sendStatus(404);
        });
        return got
          .stream(redirect.headers.location)
          .on("error", err => console.error(err))
          .pipe(resizer)
          .pipe(res);
      } else if (
        req.query.cover &&
        (response.statusCode === 404 || !response)
      ) {
        res.redirect("/placeholder-cover.jpg");
      } else if (testMediaTypes(response.headers["content-type"])) {
        return got
          .stream(redirect.headers.location)
          .on("error", err => console.error(err))
          .pipe(res);
      } else if (req.query.cover) {
        res.redirect("/placeholder-cover.jpg");
      } else {
        return res.sendStatus(404);
      }
    } catch (err) {
      if (req.query.cover) {
        res.redirect("/placeholder-cover.jpg");
      } else {
        return res.sendStatus(404);
      }
    }
  }
}

const validTypes = [
  "application/x-font-ttf",
  "font/woff2",
  "font/woff",
  "font/ttf",
  "font/sfnt",
  "font/otf",
  "image/gif",
  "image/jpeg",
  "image/png",
  "application/font-sfnt",
  "application/font-woff",
  "audio/mpeg",
  "audio/mp4",
  "video/H264",
  "video/H265",
  "video/mp4"
];

function testMediaTypes(contentType) {
  if (validTypes.includes(contentType)) {
    return true;
  }
}
