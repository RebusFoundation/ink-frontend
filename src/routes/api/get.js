import got from "got";
import { normalise } from "../../api/normalise-publication.js";
export async function get(req, res, next) {
  if (req.user) {
    try {
      const url = new URL(req.query.path, process.env.API_SERVER);
      const response = await got.get(url.href, {
        headers: {
          Authorization: `Bearer ${req.user.token}`
        },
        json: true
      });
      if (req.query.publication) {
        return res.json(normalise(response.body));
      }
      return res.json(response.body);
    } catch (err) {
      return res.sendStatus(err.statusCode || 500);
    }
  }
}
