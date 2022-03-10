const express = require('express');
const path = require('path');
const staticPath = path.join(__dirname, '../static');

const router = express.Router();

router.get("/:dir/:file", (req, res) => {
    res.sendFile(staticPath + `/${req.params.dir}/${req.params.file}`);
});

router.get("/:file", (req, res) => {
    res.sendFile(staticPath + `/${req.params.file}`);
});

module.exports = router;