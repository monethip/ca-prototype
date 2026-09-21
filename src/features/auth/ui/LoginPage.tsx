import { useState } from "react";
import type { FormEvent, MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { issueSession } from "../model/session";
import ContactFab from "./ContactFab";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [notice, setNotice] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError(true);
      return;
    }
    issueSession(username.trim());
    navigate("/portal");
  }

  function forgotPassword(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setNotice("This prototype accepts any password. No reset message is sent.");
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
          <h1>Sign in</h1>
          <p className="lede">Sign in to view certificates and extend validity.</p>
          <p className={`err${error ? " on" : ""}`}>Enter username and password to continue.</p>
          {notice ? <p className="login-notice">{notice}</p> : null}
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="login-inline-link" type="button" onClick={forgotPassword}>
              Forgot password?
            </button>
          </div>
          <button className="btn-primary" type="submit">
            Sign in
          </button>
          <p className="note">
            Don&apos;t have an account? <Link to="/signup">Create an account</Link>
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
