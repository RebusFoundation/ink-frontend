import got from "got";
export async function post(req, res, next) {
  if (req.user && req.user.profile) {
    if (typeof req.body !== 'string') {
      req.body = JSON.stringify(req.body)
    }
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
      return res.sendStatus(err.statusCode || 500);
    }
  }
}
