const express = require('express');

const router = express.Router();

router.get('/', (req, res,next) => {
    res.send("Hello, This is My first node.js Tutor")
})

module.exports = router