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

const syncEmails = async (
  emailAccountId,
  pageSize = 100,
  maxMessages = 500,
) => {
  const emailAccount = await EmailAccount.findById(emailAccountId);

  if (!emailAccount) {
    throw new Error("Email account not found");
  }

  const gmail = createGmailClient(emailAccount);

  let pageToken;
  let fetchedCount = 0;
  let syncedCount = 0;
  let updatedCount = 0;

  do {
    const remaining = maxMessages - fetchedCount;

    if (remaining <= 0) {
      break;
    }

    const listResponse = await gmail.users.messages.list({
      userId: "me",
      maxResults: Math.min(pageSize, remaining),
      ...(pageToken ? { pageToken } : {}),
    });

    const messages = listResponse.data.messages || [];
    fetchedCount += messages.length;

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
      const receivedAt = new Date(date);

      if (Number.isNaN(receivedAt.getTime())) {
        continue;
      }

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
          $set: {
            userId: emailAccount.userId,
            emailAccountId: emailAccount._id,
            emailAddress: sender.emailAddress,
            domain,
            displayName: sender.displayName,
          },
          $max: {
            lastMessageAt: receivedAt,
          },
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        },
      );

      const isRead = !(gmailMessage.labelIds || []).includes("UNREAD");
      const labels = gmailMessage.labelIds || [];

      const existingEmail = await Email.findOne({
        emailAccountId: emailAccount._id,
        gmailMessageId: gmailMessage.id,
      });

      if (existingEmail) {
        await Email.updateOne(
          { _id: existingEmail._id },
          {
            $set: {
              subject,
              receivedAt,
              isRead,
              labels,
              senderId: senderRecord._id,
              threadId: gmailMessage.threadId,
            },
          },
        );

        updatedCount++;
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
        isRead,
        labels,
      });

      await Sender.findByIdAndUpdate(senderRecord._id, {
        $inc: { messageCount: 1 },
      });

      syncedCount++;
    }

    pageToken = listResponse.data.nextPageToken;
  } while (pageToken && fetchedCount < maxMessages);

  return {
    fetched: fetchedCount,
    synced: syncedCount,
    updated: updatedCount,
  };
};

module.exports = {
  syncEmails,
};
