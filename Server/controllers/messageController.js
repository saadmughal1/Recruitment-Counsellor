const Message = require("../models/messageModel");
const jwt = require("jsonwebtoken");

const sendMessage = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const senderId = decoded.id;

    const { recipientId, content } = req.body;

    if (!recipientId || !content) {
      return res
        .status(400)
        .json({ message: "Recipient ID and content are required" });
    }

    const message = new Message({
      senderId: senderId,
      recipientId: recipientId,
      content,
    });

    const savedMessage = await message.save();

    res.status(201).json({
      message: "Message sent successfully",
      data: savedMessage,
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const loadChat = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { recipientId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: userId, recipientId: recipientId },
        { senderId: recipientId, recipientId: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const allChatsList = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const messages = await Message.find({
      $or: [{ senderId: userId }, { recipientId: userId }],
    })
      .sort({ createdAt: -1 })
      .populate("senderId", "fullname profilePhoto")
      .populate("recipientId", "fullname profilePhoto");

    const seenOppositeUsers = new Set();
    const uniqueChats = [];

    for (const msg of messages) {
      const isSender = msg.senderId._id.toString() === userId;
      const oppositeUser = isSender ? msg.recipientId : msg.senderId;

      const oppositeUserId = oppositeUser._id.toString();
      if (!seenOppositeUsers.has(oppositeUserId)) {
        seenOppositeUsers.add(oppositeUserId);
        uniqueChats.push({
          oppositeUserId,
          fullname: oppositeUser.fullname,
          profilePhoto: oppositeUser.profilePhoto,
        });
      }
    }

    res.status(200).json({
      success: true,
      data: uniqueChats,
    });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  sendMessage,
  loadChat,
  allChatsList,
};
