import got from "got";
import {normalise} from '../../api/normalise-publication.js'
import querystring from 'querystring'
export async function get(req, res, next) {
  const {page = 1, collection, reverse, orderBy} = req.query
  if (req.user && req.session.profile && req.session.profile.id) {
    try {
      let url
      if (collection === 'all') {
        const query = {
          page,
          limit: 100
        }
        if (orderBy !== 'datePublished') {
          query.orderBy = orderBy
        }
        if (reverse !== 'false') {
          query.reverse = reverse
        }
        url = `${req.session.profile.id}/library?${querystring.encode(query)}`
      } else {
        const query = {
          page,
          stack: collection,
          limit: 100
        }
        if (orderBy !== 'datePublished') {
          query.orderBy = orderBy
        }
        if (reverse !== 'false') {
          query.reverse = reverse
        }
        url = `${req.session.profile.id}/library?${querystring.encode(query)}`
      }
      const response = await got(url, {
        headers: {
          Authorization: `Bearer ${req.user.token}`
        },
        json: true
      });
      response.body.items = response.body.items.map(normalise)
      return res.json(response.body);
    } catch (err) {
      res.status(500)
      console.error('in collection: ', err)
      res.json(err)
    }
  } else {
    res.sendStatus(404)
  }
}
