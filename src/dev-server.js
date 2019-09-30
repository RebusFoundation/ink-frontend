import sirv from "sirv";
import httpStrategies from "passport-http";
import passport from "passport";
import dotenv from "dotenv";
// import * as fs from "fs";
// import * as https from "https";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";
if (dev) {
  const result = dotenv.config();
  if (result.error) {
    throw result.error;
  }
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
}
// const options = {
//   key: fs.readFileSync("./dev/localhost.key"),
//   cert: fs.readFileSync("./dev/localhost.cert"),
//   requestCert: false,
//   rejectUnauthorized: false
// };

export function devServer(app, sapper) {
  passport.use(
    new httpStrategies.BasicStrategy((username, password, callback) => {
      if (password === "devpassword") {
        const user = { id: `dev-testing11|${username}` };
        return callback(null, user);
      } else {
        return callback(null, false);
      }
    })
  );
  app.use(
    sirv("dev-static", { dev }),
    sirv("static", { dev }),
    // (req, res, next) => {
    //   if (req.path === '/callback') {
    //     return next()
    //   } else {
    //     return csurf()(req, res, next)
    //   }
    // },
    // (req, res, next) => {
    //   res.cookie("XSRF-TOKEN", req.csrfToken());
    //   next();
    // },

    sapper.middleware({
      session: (req, res) => {
        let profile;
        if (req.session && req.session.profile) {
          profile = req.session.profile;
        }
        return {
          user: req.user,
          profile
        };
      }
    })
  );

  // const server = https.createServer(options, app);
  app.listen(PORT);
  // server.listen(PORT, function(err) {
  //   if (err) console.log("error", err);
  //   console.log("Express server listening on port " + server.address().port);
  // });
}
