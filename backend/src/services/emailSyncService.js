const EmailAccount = require("../models/EmailAccount");
const Sender = require("../models/Sender");
const Email = require("../models/Email");
const { createGmailClient } = require("./gmailService");

const getHeader = (headers, name) => {
  const header = headers.find(
    (item) => item.name.toLowerCase() === name.toLowerCase(),
  );

  return header?.value || "";
};

const parseSender = (from) => {
  const match = from.match(/^(.*?)\s*<([^>]+)>$/);

  if (match) {
    return {
      displayName: match[1].replace(/^"|"$/g, "").trim(),
      emailAddress: match[2].trim().toLowerCase(),
    };
  }

  return {
    displayName: "",
    emailAddress: from.trim().toLowerCase(),
  };
};

const syncEmails = async (emailAccountId, maxResults = 20) => {
  const emailAccount = await EmailAccount.findById(emailAccountId);

  if (!emailAccount) {
    throw new Error("Email account not found");
  }

  const gmail = createGmailClient(emailAccount);

  const listResponse = await gmail.users.messages.list({
    userId: "me",
    maxResults,
  });

  const messages = listResponse.data.messages || [];

  let syncedCount = 0;

  for (const message of messages) {
    const messageResponse = await gmail.users.messages.get({
      userId: "me",
      id: message.id,
      format: "metadata",
      metadataHeaders: ["From", "Subject", "Date"],
    });

    const gmailMessage = messageResponse.data;

    const headers = gmailMessage.payload?.headers || [];

    const from = getHeader(headers, "From");
    const subject = getHeader(headers, "Subject");
    const date = getHeader(headers, "Date");

    const sender = parseSender(from);

    if (!sender.emailAddress) {
      continue;
    }

    const domain = sender.emailAddress.split("@")[1];

    if (!domain) {
      continue;
    }

    const senderRecord = await Sender.findOneAndUpdate(
      {
        userId: emailAccount.userId,
        emailAccountId: emailAccount._id,
        emailAddress: sender.emailAddress,
      },
      {
        userId: emailAccount.userId,
        emailAccountId: emailAccount._id,
        emailAddress: sender.emailAddress,
        domain,
        displayName: sender.displayName,
        lastMessageAt: new Date(date),
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    const existingEmail = await Email.findOne({
      emailAccountId: emailAccount._id,
      gmailMessageId: gmailMessage.id,
    });

    if (existingEmail) {
      continue;
    }

    await Email.create({
      userId: emailAccount.userId,
      emailAccountId: emailAccount._id,
      senderId: senderRecord._id,
      gmailMessageId: gmailMessage.id,
      threadId: gmailMessage.threadId,
      subject,
      receivedAt,
      isRead: !(gmailMessage.labelIds || []).includes("UNREAD"),
      labels: gmailMessage.labelIds || [],
    });

    await Sender.findByIdAndUpdate(senderRecord._id, {
      $inc: { messageCount: 1 },
    });

    syncedCount++;
  }

  return {
    fetched: messages.length,
    synced: syncedCount,
  };
};

module.exports = {
  syncEmails,
};
