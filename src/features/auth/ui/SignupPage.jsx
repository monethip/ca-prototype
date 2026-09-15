import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { issueSession } from "../model/session.js";
import { initEmptyCerts } from "../../certificates";
import { writeHistory } from "../../invoices";
import ContactFab from "./ContactFab.jsx";

export default function SignupPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Enter username and password to continue.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    issueSession(username.trim(), { isNew: true });
    initEmptyCerts(username.trim());
    writeHistory(username.trim(), []);
    navigate("/portal");
  }

  return (
    <div className="login-page">
      <header className="login-head">
        <nav className="top-nav">
          <Link className="brand" to="/login">
            <span className="mark" aria-hidden="true"></span>
            CA - Prototype
          </Link>
        </nav>
      </header>
      <main>
        <form className="card" onSubmit={onSubmit}>
          <h1>Sign up</h1>
          <p className="lede">Create an account to view certificates and extend validity.</p>
          <p className={`err${error ? " on" : ""}`}>{error || "Enter username and password to continue."}</p>
          <div className="field">
            <label htmlFor="signupUsername">Username</label>
            <input
              id="signupUsername"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="signupPassword">Password</label>
            <input
              id="signupPassword"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="signupConfirm">Confirm password</label>
            <input
              id="signupConfirm"
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          <button className="btn-primary" type="submit">
            Sign up
          </button>
          <p className="note">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </main>
      <footer className="login-foot">
        <div className="login-foot-inner">
          <p>© 2026 CA Prototype. All rights reserved.</p>
        </div>
      </footer>
      <ContactFab />
    </div>
  );
}
