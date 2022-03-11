const express = require('express');
const path = require('path');
const staticPath = path.join(__dirname, '../static');

const router = express.Router();

router.get("/:dir/:file", (req, res) => {
    try{
        res.sendFile(staticPath + `/${req.params.dir}/${req.params.file}`);
    }
    catch {
        res.status(500).send();
    }
});

router.get("/:file", (req, res) => {
    try{
        res.sendFile(staticPath + `/${req.params.file}`);
    }
    catch {
        res.status(500).send();
    }
});

module.exports = router;