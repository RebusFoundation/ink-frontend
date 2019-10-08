import got from "got";
import { normalise } from "../api/normalise-publication.js";
export async function get(req, res, next) {
  // console.log('recent: ', req.user, req.user.profile)
  if (req.user && req.user.profile && req.user.profile.id) {
    try {
      const response = await got(`${req.user.profile.id}/library?limit=10`, {
        headers: {
          Authorization: `Bearer ${req.user.token}`
        },
        json: true
      });
      response.body.items = response.body.items.map(normalise);
      return res.json(response.body);
    } catch (err) {
      res.status(500);
      console.error("in recent: ", err);
      res.json(err);
    }
  } else {
    res.status(404);
    res.send({ status: 404 });
  }
}
