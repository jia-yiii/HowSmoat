const passport = require('passport');
const LineStrategy = require('passport-line').Strategy;
const jwt = require('jsonwebtoken');

passport.use(new LineStrategy({
  channelID: process.env.LINE_CHANNEL_ID,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  callbackURL: process.env.LINE_LOGIN_CALLBACK,
  scope: ['profile', 'openid', 'email']
}, function (accessToken, refreshToken, params, profile, done) {
  // ✅ 解開 id_token 裡的 email
  const decoded = jwt.decode(params.id_token);
  const email = decoded?.email;

  console.log('📨 解出 email:', email);

  profile.email = email;
  return done(null, profile);
}));