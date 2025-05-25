// upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// 設定檔案儲存位置與命名
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'media'); // 儲存到 media 資料夾
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    file.uniqueName = uniqueName; // 將 uniqueName 加入 file 中
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

router.post('/uploadimg', upload.single('image'), (req, res) => {
    console.log('post /uploadimg');
    
    const file = req.file;
  if (!file) return res.status(400).send('No file uploaded.');
  res.json({ filename: file.uniqueName });
});

module.exports = router;
