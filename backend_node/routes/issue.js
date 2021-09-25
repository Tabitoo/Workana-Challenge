const express = require('express');
const router = express.Router();
const {issueJoin, issuePrueba, getIssue, issueVote, restarIssue,deleteIssue} = require("../controllers/issueController");


router.get("/prueba", issuePrueba);
router.get("/:id", getIssue);
router.post('/:issue/join',issueJoin);
router.post("/:issue/vote", issueVote);
router.put("/:issue/restar", restarIssue);
router.delete("/:issue/delete", deleteIssue);


module.exports = router;
