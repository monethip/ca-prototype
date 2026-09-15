const KEY = "ca_prototype_session";

export function readSession() {
  try {
    const session = JSON.parse(sessionStorage.getItem(KEY) || "null");
    if (session && !session.username && session.email) {
      return { ...session, username: session.email };
    }
    return session;
  } catch {
    return null;
  }
}

export function writeSession(session) {
  sessionStorage.setItem(KEY, JSON.stringify(session));
}

export function clearSession() {
  sessionStorage.clear();
}

export function isAuthed() {
  const session = readSession();
  return Boolean(session && session.token);
}

export function issueSession(username, extras = {}) {
  const session = {
    username,
    email: extras.email || "",
    token: "snt_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36),
    issuedAt: new Date().toISOString(),
    isNew: Boolean(extras.isNew),
  };
  writeSession(session);
  return session;
}
