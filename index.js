const express = require("express");
const passport = require("passport");
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const session = require("express-session");
require("dotenv").config();

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/linkedin/callback",
      scope: ["r_emailaddress"],
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

app.get("/", (req, res) => {
  res.send('<a href="/auth/linkedin">Login with LinkedIn</a>');
});

app.get(
  "/auth/linkedin",
  passport.authenticate("linkedin", { state: "SOME_STATE" })
);

app.get(
  "/auth/linkedin/callback",
  passport.authenticate("linkedin", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
  }
);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
