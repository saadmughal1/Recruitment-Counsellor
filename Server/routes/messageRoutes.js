const express = require("express");
const router = express.Router();

const { loadChat, sendMessage } = require("../controllers/messageController");

router.get("/load-chat/:recipientId", loadChat);
router.post("/send-message", sendMessage);

module.exports = router;
