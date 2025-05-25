const express = require('express');
const app = express.Router();
const crypto = require('crypto');
const sendResetPasswordEmail = require('../utils/sendResetPasswordEmail');
const mysql = require('mysql2/promise');

// DB 
const conn = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'howsmoat'
});

// 申請重設密碼：發送 email
app.post('/request-reset', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: '請填寫註冊的email' });

  try {
    // 檢查是否為已註冊 email
    const [users] = await conn.query('SELECT * FROM userinfo WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ success: false, message: '此帳號未註冊' });
    }

    // 產生 token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 分鐘後到期

    // 存入 password_reset_tokens 資料表
    await conn.query('DELETE FROM password_reset_tokens WHERE email = ?', [email]); // 清除舊 token
    await conn.query(
      'INSERT INTO password_reset_tokens (email, token, expires_at) VALUES (?, ?, ?)',
      [email, token, expiresAt]
    );

    await sendResetPasswordEmail(email, token);

    res.json({ success: true, message: '重設密碼連結已寄出，請至信箱查看' });

  } catch (err) {
    console.error('❌ 重設密碼請求錯誤:', err);
    res.status(500).json({ success: false, message: '伺服器錯誤' });
  }
});

// 驗證 token
app.post('/verify-token', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ success: false, message: '缺少 token' });

  try {
    const [rows] = await conn.query(
      'SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > NOW()',
      [token]
    );
    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: '連結已失效或無效' });
    }
    res.json({ success: true, email: rows[0].email });
  } catch (err) {
    console.error('驗證 token 錯誤:', err);
    res.status(500).json({ success: false, message: '伺服器錯誤' });
  }
});

// 重設密碼
app.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ success: false, message: '缺少必要參數' });
  }

  try {
    const [rows] = await conn.query(
      'SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > NOW()',
      [token]
    );
    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: '連結無效或已過期' });
    }

    const email = rows[0].email;

    await conn.query('UPDATE userinfo SET password = ? WHERE email = ?', [newPassword, email]);

    // 刪除用過的 token
    await conn.query('DELETE FROM password_reset_tokens WHERE email = ?', [email]);

    res.json({ success: true, message: '密碼已成功重設' });
  } catch (err) {
    console.error('重設密碼錯誤:', err);
    res.status(500).json({ success: false, message: '伺服器錯誤' });
  }
});

module.exports = app;