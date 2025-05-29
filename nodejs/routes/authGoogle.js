const express = require('express');
const router = express.Router();
const passport = require('passport');


// ✅ 導向 Google 登入，加上 log
router.get('/google', (req, res, next) => {
  console.log('➡️ /auth/google 被打到了！');
  next();
}, passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// ✅ Google 登入回調
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  handleGoogleCallback
);

async function handleGoogleCallback(req, res) {
  const { q } = require('../sql'); // ✅ 延遲引用且只宣告一次

  const email = req.user.emails?.[0]?.value;
  const providerId = req.user.id;
  const provider = 'google';

  try {
    // 1️⃣ 查 userinfo 是否已有這個 email
    const [user] = await q(`SELECT uid FROM userinfo WHERE email = ?`, [email]);

    if (user) {
      const uid = user.uid.toString();

      // 2️⃣ 查是否已綁定 third_user
      const [third] = await q(`SELECT * FROM third_user WHERE provider = ? AND provider_id = ?`, [provider, providerId]);

      if (!third) {
        await q(`INSERT INTO third_user (uid, provider, provider_id) VALUES (?, ?, ?)`, [uid, provider, providerId]);
        console.log("✅ 已綁定第三方帳號");
      } else {
        console.log("🔄 已存在第三方綁定");
      }

      req.session.user_uid = uid;
      res.cookie('user_uid', uid, {
        httpOnly: false, // ❗ 允許前端讀取
        maxAge: 1000 * 60 * 60 * 24, // 1 天
        sameSite: 'Lax', // 為了安全性保留
        domain: 'localhost',
        path: '/' // ⬅️ 確保整站能拿到
      });

      const [userPowerResult] = await q(`SELECT power FROM userinfo WHERE uid = ?`, [uid]);
      console.log("🔍 查詢權限回傳：", userPowerResult);
      const userPower = userPowerResult?.power || 'buyer';

      res.cookie('user_power', userPower, {
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'Lax',
        domain: 'localhost',
        path: '/'
      });


      console.log("🍪 已設 cookie user_uid =", uid);
      console.log("🍪 已設 cookie user_power =", userPower);
      console.log("✅ 登入成功，導首頁");
      return res.redirect(`http://localhost:3000/Third_SetCookie?uid=${uid}&user_power=${userPower}`);
    } else {
      return res.redirect(
        `http://localhost:3000/register?email=${encodeURIComponent(email)}&provider=${provider}&provider_id=${providerId}`
      );
    }
  } catch (err) {
    console.error("❌ Google callback 發生錯誤：", err);
    return res.redirect('http://localhost:3000/login');
  }
}
module.exports = router;