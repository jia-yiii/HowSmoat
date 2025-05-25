// uploadArticleImg.js
const multer = require('multer');
const fs    = require('fs');
const path  = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { article_type, pet_type } = req.body;
    // 統一往 fashion-paw/public/media/pet_know/裡丟
    const dest = path.resolve(
      __dirname,
      '../fashion-paw/public/media/pet_know',
      article_type,   // health_check or pet_feeding
      pet_type        // dog / cat / bird / mouse
    );
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

module.exports = multer({ storage });
