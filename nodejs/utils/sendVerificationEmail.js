require('dotenv').config();

const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  REFRESH_TOKEN,
  GMAIL_USER
} = process.env;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendVerificationEmail(toEmail, code) {
  try {
    const accessTokenResponse = await oAuth2Client.getAccessToken();
    const accessToken = accessTokenResponse.token;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: GMAIL_USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken,
      },
    });

    const mailOptions = {
      from: `"好拾毛客服" <${GMAIL_USER}>`,
      to: toEmail,
      subject: '好拾毛寵物購物網 — 註冊驗證碼',
      text: `您好，歡迎註冊好拾毛寵物用品購物網～\n您的驗證碼為：${code}。\n請於 10 分鐘內完成驗證。\n\n此信件由系統自動發送，請勿回覆。`,
      html: `
        <p>您好，</p>
        <p>歡迎註冊好拾毛寵物用品購物網～</p>
        <p>您的驗證碼為：<span style="
    font-size:30px;color:#70823C;">${code}</span></p>
        
        <p>此驗證碼將在 10 分鐘後失效，請盡快完成驗證。</p>
        <br/>
        <p style="font-size:12px;color:#999;">本郵件由系統自動發送，請勿直接回覆。</p>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ 驗證碼已成功寄送至 ${toEmail}`);
    return result;
  } catch (error) {
    console.error('❌ 發送驗證碼失敗:', error);
    throw error;
  }
}

module.exports = sendVerificationEmail;