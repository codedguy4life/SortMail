const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const Sender = require("../models/Sender");
const Email = require("../models/Email");

const router = express.Router();

/*
  GET /api/senders

  Returns senders belonging to the authenticated user.
*/
router.get("/", authMiddleware, async (req, res) => {
  try {
    const senders = await Sender.find({
      userId: req.user.userId,
    })
      .sort({
        messageCount: -1,
        lastMessageAt: -1,
      })
      .select(
        "_id emailAddress domain displayName category messageCount lastMessageAt",
      );

    return res.status(200).json({
      success: true,
      count: senders.length,
      senders,
    });
  } catch (error) {
    console.error("Get senders error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while getting senders",
    });
  }
});

/*
  GET /api/senders/:senderId/emails

  Returns emails belonging to a specific sender.

  IMPORTANT:
  We check BOTH:
    senderId
    userId

  This prevents one user from requesting another user's sender.
*/
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
      .sort({
        receivedAt: -1,
      })
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
