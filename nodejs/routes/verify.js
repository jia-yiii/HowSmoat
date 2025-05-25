const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const sendVerificationEmail = require('../utils/sendVerificationEmail');

// ✅ 資料庫連線（使用 mysql2/promise）
const conn = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'howsmoat',
    waitForConnections: true,
    connectionLimit: 10,
});

// 產生 6 碼驗證碼
function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// ✅ 發送驗證碼
router.post('/send-verification-code', async (req, res) => {
    const { email } = req.body;

    try {
        // 1. 檢查 email 是否已註冊
        const [existingUsers] = await conn.query(
            'SELECT * FROM userinfo WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email已註冊，請直接登入'
            });
        }

        // 2. 產生驗證碼與時間
        const code = generateCode();
        const createdAt = new Date();
        const expiresAt = new Date(createdAt.getTime() + 10 * 60 * 1000);
       
        // 測試印出寄信前的內容
        console.log(`📤 準備寄送驗證碼給 ${email}：${code}`);

        // 3. 發送 email
        await sendVerificationEmail(email, code);

        // 4. 刪除舊紀錄
        await conn.query('DELETE FROM email_verification WHERE email = ?', [email]);

        // 5. 插入新驗證碼
        await conn.query(
            'INSERT INTO email_verification (email, code, created_at, expires_at) VALUES (?, ?, ?, ?)',
            [email, code, createdAt, expiresAt]
        );

        res.json({ success: true, message: '驗證碼已寄出' });

    } catch (err) {
        console.error('❌ 發送流程錯誤:', err);
        res.status(500).json({
            success: false,
            message: '伺服器錯誤，請稍後再試'
        });
    }
});

// ✅ 驗證驗證碼
router.post('/verify-code', async (req, res) => {
    const { email, code } = req.body;

    try {
        const [rows] = await conn.query(
            'SELECT * FROM email_verification WHERE email = ? AND code = ? AND expires_at > NOW()',
            [email, code]
        );

        if (rows.length > 0) {
            await conn.query('DELETE FROM email_verification WHERE email = ?', [email]);
            res.json({ success: true, message: '驗證成功' });
        } else {
            res.json({ success: false, message: '驗證碼錯誤或已過期' });
        }
    } catch (err) {
        console.error('驗證碼檢查失敗:', err);
        res.status(500).json({ success: false, message: '伺服器錯誤' });
    }
});

module.exports = router;