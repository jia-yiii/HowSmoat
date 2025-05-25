const express = require('express');
const router = express.Router();

router.post('/CVScallback.html', express.urlencoded({ extended: true }), (req, res) => {
  // console.log("✅ 綠界原始門市資料：", req.body);

  const query = new URLSearchParams({
    storeid: req.body.storeid,
    storename: req.body.storename,
  }).toString();

  res.redirect(`http://localhost:3000/CVScallback.html?${query}`);
});

module.exports = router;