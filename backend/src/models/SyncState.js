const mongoose = require("mongoose");

const syncStateSchema = new mongoose.Schema(
  {
    emailAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmailAccount",
      required: true,
      unique: true,
      index: true,
    },

    historyId: {
      type: String,
    },

    lastSyncedAt: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["idle", "syncing", "completed", "failed"],
      default: "idle",
    },

    errorMessage: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("SyncState", syncStateSchema);
