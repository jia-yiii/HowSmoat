//google passport
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_LOGIN_CLIENT_ID,
  clientSecret: process.env.GOOGLE_LOGIN_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_LOGIN_CALLBACK
}, (accessToken, refreshToken, profile, done) => {
  console.log("✅ 使用者登入成功", profile);
  // 你可以選擇儲存 profile 到資料庫
  return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));