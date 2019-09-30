
import * as sapper from "@sapper/server";
import {setup as serverSetup} from './setup.js'
import * as path from 'path'
import admin from 'firebase-admin'
// import debugSetup from 'debug'
// const debug = debugSetup('vonnegut:server')

const { NODE_ENV, PORT } = process.env;
const dev = NODE_ENV === "development";

if (dev) {
  const serviceAccount = require(path.resolve(__dirname, '../../../keyfile.json'));
  const firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://thematic-cider-139815.firebaseio.com"
  })
  const app = serverSetup(sapper, {firebase})
  app.listen(PORT)
}

function setup (options) {
  return serverSetup(sapper, options)
}

export { sapper, setup };

// Need to set this up to actually use https.
