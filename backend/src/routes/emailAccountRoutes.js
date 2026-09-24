const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const googleOAuth2Client = require("../config/google");
const EmailAccount = require("../models/EmailAccount");
const SyncState = require("../models/SyncState");
const { syncEmails } = require("../services/emailSyncService");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Email accounts route is protected",
      userId: req.user.userId,
    });
  } catch (error) {
    console.error("Email accounts error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

router.get("/google", authMiddleware, (req, res) => {
  const authorizationUrl = googleOAuth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/gmail.readonly"],
    state: req.user.userId,
  });

  return res.redirect(authorizationUrl);
});

router.get("/google/callback", async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Authorization code is missing",
      });
    }

    if (!state) {
      return res.status(400).json({
        success: false,
        message: "OAuth state is missing",
      });
    }

    const { tokens } = await googleOAuth2Client.getToken(code);

    console.log("Google OAuth tokens received");
    console.log("Has access token:", Boolean(tokens.access_token));
    console.log("Has refresh token:", Boolean(tokens.refresh_token));

    googleOAuth2Client.setCredentials(tokens);

    const gmail = googleOAuth2Client;

    const gmailResponse = await require("googleapis")
      .google.gmail({
        version: "v1",
        auth: gmail,
      })
      .users.getProfile({
        userId: "me",
      });

    const gmailProfile = gmailResponse.data;

    console.log("Connected Gmail account:", gmailProfile.emailAddress);

    const emailAccount = await EmailAccount.findOneAndUpdate(
      {
        userId: state,
        provider: "google",
        providerAccountId: gmailProfile.emailAddress,
      },
      {
        userId: state,
        provider: "google",
        emailAddress: gmailProfile.emailAddress,
        providerAccountId: gmailProfile.emailAddress,
        accessToken: tokens.access_token,
        ...(tokens.refresh_token ? { refreshToken: tokens.refresh_token } : {}),
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    await SyncState.findOneAndUpdate(
      {
        emailAccountId: emailAccount._id,
      },
      {
        emailAccountId: emailAccount._id,
        status: "idle",
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Gmail account connected successfully",
      emailAccount: {
        id: emailAccount._id,
        emailAddress: emailAccount.emailAddress,
        provider: emailAccount.provider,
      },
    });
  } catch (error) {
    console.error("Google OAuth callback error:", error.message);
    console.error("Google OAuth callback response:", error.response?.data);

    return res.status(500).json({
      success: false,
      message: "Google OAuth failed",
    });
  }
});

router.post("/:emailAccountId/sync", authMiddleware, async (req, res) => {
  try {
    const { emailAccountId } = req.params;

    const emailAccount = await EmailAccount.findOne({
      _id: emailAccountId,
      userId: req.user.userId,
    });

    if (!emailAccount) {
      return res.status(404).json({
        success: false,
        message: "Email account not found",
      });
    }

    const result = await syncEmails(emailAccount._id, 20);

    await SyncState.findOneAndUpdate(
      {
        emailAccountId: emailAccount._id,
      },
      {
        status: "completed",
        lastSyncedAt: new Date(),
        errorMessage: null,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Email sync completed",
      result,
    });
  } catch (error) {
    console.error("Email sync error:", error);

    return res.status(500).json({
      success: false,
      message: "Email sync failed",
    });
  }
});

module.exports = router;
