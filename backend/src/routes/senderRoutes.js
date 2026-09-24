const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const Sender = require("../models/Sender");
const Email = require("../models/Email");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const senders = await Sender.find({ userId: req.user.userId })
      .sort({ messageCount: -1, lastMessageAt: -1 })
      .select("_id emailAddress domain displayName category messageCount lastMessageAt")
      .lean();

    const senderIds = senders.map((sender) => sender._id);

    const latestEmails = await Email.aggregate([
      { $match: { userId: new (require("mongoose").Types.ObjectId)(req.user.userId), senderId: { $in: senderIds } } },
      { $sort: { receivedAt: -1 } },
      {
        $group: {
          _id: "$senderId",
          latestSubject: { $first: "$subject" },
          latestReceivedAt: { $first: "$receivedAt" },
          unreadCount: {
            $sum: { $cond: [{ $eq: ["$isRead", false] }, 1, 0] },
          },
        },
      },
    ]);

    const latestBySender = new Map(latestEmails.map((item) => [item._id.toString(), item]));

    const enrichedSenders = senders.map((sender) => {
      const latest = latestBySender.get(sender._id.toString());

      return {
        ...sender,
        latestSubject: latest?.latestSubject || "",
        latestReceivedAt: latest?.latestReceivedAt || sender.lastMessageAt || null,
        unreadCount: latest?.unreadCount || 0,
      };
    });

    return res.status(200).json({
      success: true,
      count: enrichedSenders.length,
      senders: enrichedSenders,
    });
  } catch (error) {
    console.error("Get senders error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while getting senders",
    });
  }
});

router.get("/:senderId/emails", authMiddleware, async (req, res) => {
  try {
    const { senderId } = req.params;

    const sender = await Sender.findOne({
      _id: senderId,
      userId: req.user.userId,
    });

    if (!sender) {
      return res.status(404).json({
        success: false,
        message: "Sender not found",
      });
    }

    const emails = await Email.find({
      senderId: sender._id,
      userId: req.user.userId,
    })
      .sort({ receivedAt: -1 })
      .select("_id gmailMessageId threadId subject receivedAt isRead labels");

    return res.status(200).json({
      success: true,
      sender: {
        id: sender._id,
        emailAddress: sender.emailAddress,
        domain: sender.domain,
        displayName: sender.displayName,
        category: sender.category,
        messageCount: sender.messageCount,
        lastMessageAt: sender.lastMessageAt,
      },
      count: emails.length,
      emails,
    });
  } catch (error) {
    console.error("Get sender emails error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while getting sender emails",
    });
  }
});

module.exports = router;
