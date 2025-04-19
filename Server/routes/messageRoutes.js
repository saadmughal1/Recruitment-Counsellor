const express = require("express");
const router = express.Router();

const {
  loadChat,
  sendMessage,
  allChatsList,
} = require("../controllers/messageController");

router.get("/load-chat/:recipientId", loadChat);
router.post("/send-message", sendMessage);
router.get("/all-chats-list", allChatsList);

module.exports = router;
