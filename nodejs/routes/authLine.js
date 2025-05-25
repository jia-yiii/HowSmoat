const express = require('express');
const router = express.Router();
const passport = require('passport');


// ✅ 導向 LINE 登入
router.get('/line', (req, res, next) => {
  console.log('➡️ /auth/line 被打到了！');
  next();
}, passport.authenticate('line', {
  scope: ['profile', 'openid', 'email']
}));

// ✅ LINE 登入回調
router.get('/line/callback',
  passport.authenticate('line', { failureRedirect: '/' }),
  handleLineCallback
);

// 處理 LINE callback 登入邏輯
async function handleLineCallback(req, res) {
  console.log('👉 req.user:', req.user);
  console.log('👉 req.user.email:', req.user?.email);

  const { q } = require('../sql'); // 延遲引用
  const email = req.user?.email;
  const providerId = req.user.id;
  const provider = 'line';
  try {
    // 1️⃣ 查 userinfo 是否已有此 email
    const [user] = await q(`SELECT uid FROM userinfo WHERE email = ?`, [email]);

    if (user) {
      const uid = user.uid.toString();

      // 2️⃣ 查是否已綁定 third_user
      const [third] = await q(`SELECT * FROM third_user WHERE provider = ? AND provider_id = ?`, [provider, providerId]);

      if (!third) {
        await q(`INSERT INTO third_user (uid, provider, provider_id) VALUES (?, ?, ?)`, [uid, provider, providerId]);
        console.log("✅ 已綁定 LINE 帳號");
      } else {
        console.log("🔄 已存在 LINE 綁定");
      }

      req.session.user_uid = uid;
      res.cookie('user_uid', uid, {
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'Lax',
        domain: 'localhost',
        path: '/'
      });

      console.log("🍪 已設 cookie user_uid =", uid);
      return res.redirect(`http://localhost:3000/Third_SetCookie?uid=${uid}`);
    } else {
      // 導向補充註冊頁（帶上 email）
      return res.redirect(
        `http://localhost:3000/register?email=${encodeURIComponent(email)}&provider=${provider}&provider_id=${providerId}`
      );
    }
  } catch (err) {
    console.error("❌ LINE callback 發生錯誤：", err);
    return res.redirect('http://localhost:3000/login');
  }
}

module.exports = router;