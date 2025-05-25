// uploadProductImg.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

module.exports = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      // 從 URL 拿到 condition：'new' or 'second'
      let condition = req.params.condition;
      if (!condition) {
        const url = req.baseUrl || req.originalUrl;
        condition = url.includes('second') ? 'second' : 'new';
      }
      const petType = req.body.pet_type;       // 狗 or 貓…
      const category = req.body.categories;     // 只有新品才會用到

      // 根據 condition 決定根目錄
      const baseDir = path.join(
        __dirname,
        'public',
        'media',
        condition === 'second' ? 'second_pd' : 'new_pd'
      );

      // 二手只要 petType，正式新品才要再加 categories
      const destDir =
        condition === 'second'
          ? path.join(baseDir, petType)
          : path.join(baseDir, petType, category);

      // 確保資料夾存在
      fs.mkdirSync(destDir, { recursive: true });
      cb(null, destDir);
    },
   filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random()*1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
})
}).array('images', 4);
