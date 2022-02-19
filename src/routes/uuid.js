const { Console } = require('console');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const genUUID = require(path.join(__dirname, '../services/uuidGenService'));
const uploadPath = require(path.join(__dirname, '../services/uploadsPathService'));

const router = express.Router();
router.use(cookieParser());

router.get("/getNew", (req, res, next) => {
    let uuid = genUUID(uploadPath);
    res.json({ id : uuid });
});

module.exports = router;