const { google } = require("googleapis");

const createGmailClient = (emailAccount) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );

  oauth2Client.setCredentials({
    access_token: emailAccount.accessToken,
    refresh_token: emailAccount.refreshToken,
  });

  return google.gmail({
    version: "v1",
    auth: oauth2Client,
  });
};

module.exports = {
  createGmailClient,
};
