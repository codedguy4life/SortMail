const mongoose = require("mongoose");

const senderSchema = new mongoose.Schema(
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

    emailAddress: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    domain: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    displayName: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    category: {
      type: String,
      enum: [
        "unknown",
        "person",
        "company",
        "subscription",
        "transaction",
        "notification",
      ],
      default: "unknown",
    },

    messageCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastMessageAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

senderSchema.index(
  {
    userId: 1,
    emailAccountId: 1,
    emailAddress: 1,
  },
  {
    unique: true,
  },
);
module.exports = mongoose.model("Sender", senderSchema);
