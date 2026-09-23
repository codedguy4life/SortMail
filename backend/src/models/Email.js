const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    emailAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmailAccount",
      required: true,
      index: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sender",
      required: true,
      index: true,
    },

    gmailMessageId: {
      type: String,
      required: true,
    },

    threadId: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    receivedAt: {
      type: Date,
      required: true,
      index: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    labels: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

emailSchema.index(
  {
    emailAccountId: 1,
    gmailMessageId: 1,
  },
  {
    unique: true,
  },
);

module.exports = mongoose.model("Email", emailSchema);
