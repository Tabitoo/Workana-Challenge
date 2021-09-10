const express = require('express');
const router = express.Router();
const {issueJoin, issuePrueba, getIssue} = require("../controllers/issueController");

router.get("/prueba", issuePrueba);
router.get("/:id", getIssue);
router.post('/:issue/join',issueJoin);



module.exports = router;
