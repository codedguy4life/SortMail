const EmailList = ({ emails }) => (
  <section className="email-history">
    <div className="panel-section-heading">
      <h3>Email history</h3>
      <span>{emails.length}</span>
    </div>

    {emails.length ? (
      <div className="email-list">
        {emails.map((email) => (
          <article className={`email-row ${email.isRead ? "" : "unread"}`} key={email._id}>
            <span className="email-dot" />
            <div>
              <strong>{email.subject || "(No subject)"}</strong>
              <p>{new Date(email.receivedAt).toLocaleString()}</p>
            </div>
          </article>
        ))}
      </div>
    ) : (
      <p className="muted">No emails found for this sender.</p>
    )}
  </section>
);

export default EmailList;
