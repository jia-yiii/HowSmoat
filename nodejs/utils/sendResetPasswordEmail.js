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

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendResetPasswordEmail(toEmail, token) {
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

    const resetLink = `http://localhost:3000/MemberCenter/autoLoginByToken?token=${token}`; // 前端頁面連結

    const mailOptions = {
      from: `"好拾毛客服" <${GMAIL_USER}>`,
      to: toEmail,
      subject: '好拾毛 - 密碼重設連結',
      html: `
        <p>您好，</p>
        <p>我們收到您的忘記密碼申請，請點選下方連結進行密碼重設：</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>此連結將在 15 分鐘後失效。</p>
        <p style="font-size:12px;color:#999;">若您未申請此操作，請忽略此信件。</p>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ 重設密碼連結已寄至 ${toEmail}`);
    return result;
  } catch (error) {
    console.error('❌ 發送重設密碼信件失敗:', error);
    throw error;
  }
}

module.exports = sendResetPasswordEmail;