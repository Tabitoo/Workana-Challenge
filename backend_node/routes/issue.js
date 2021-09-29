const express = require('express');
const router = express.Router();
const {issueJoin, getIssue, issueVote, restarIssue,deleteIssue} = require("../controllers/issueController");
const tokenCheck = require('../middlewares/authToken');



router.get("/:issue", tokenCheck, getIssue);
router.post('/:issue/join', issueJoin);
router.post("/:issue/vote", tokenCheck, issueVote);
router.put("/:issue/restar", restarIssue);
router.delete("/:issue/delete", tokenCheck, deleteIssue);


module.exports = router;
