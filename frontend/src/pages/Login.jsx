import { useState } from "react";
import { loginUser } from "../api/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.location.href = "/";
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-shell">
        <section className="login-intro">
          <div className="brand login-brand">
            <span className="brand-mark">S</span>
            <span>SortMail</span>
          </div>
          <p className="login-kicker">A calmer way to manage email</p>
          <h1>See who is filling your inbox.</h1>
          <p className="login-copy">
            SortMail organizes your inbox around senders, relationships and useful actions — without the clutter.
          </p>
          <div className="login-features">
            <span><i className="feature-dot green" />People and companies in one view</span>
            <span><i className="feature-dot purple" />Spot frequent senders quickly</span>
            <span><i className="feature-dot amber" />Find cleanup opportunities</span>
          </div>
        </section>

        <section className="login-card">
          <div className="login-card-header">
            <p className="eyebrow">Welcome back</p>
            <h2>Sign in to SortMail</h2>
            <p>Continue organizing your inbox.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="field">
              <div className="field-label-row">
                <label htmlFor="password">Password</label>
                <span>Secure sign-in</span>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Your password"
                autoComplete="current-password"
                required
              />
            </div>

            {error && <p className="login-error">{error}</p>}

            <button className="login-submit" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Continue"}
              <span>→</span>
            </button>
          </form>

          <p className="login-footnote">Your email data stays connected to your SortMail account.</p>
        </section>
      </div>
    </main>
  );
};

export default Login;
