const express = require('express');
const router = express.Router();
const {issueJoin} = require("../controllers/issueController");

router.post('/:issue/join',issueJoin);



module.exports = router;
