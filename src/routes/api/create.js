import got from "got";
export async function post(req, res, next) {
  if (typeof req.body !== 'string') {
    req.body = JSON.stringify(req.body)
  }
  if (req.user && req.user.profile) {
    try {
      const response = await got.post(req.user.profile.outbox, {
        headers: {
          "content-type": "application/ld+json",
          Authorization: `Bearer ${req.user.token}`
        },
        body: req.body
      });
      res.location(response.headers.location);
      return res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.status(500)
      return res.json(err.body);
    }
  }
}
