const SESSION_KEY = "pie_manager_session";
const SESSION_EVENT = "pie_manager_session_changed";

function notifySessionChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(SESSION_EVENT));
  }
}

export function getSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedSession = window.localStorage.getItem(SESSION_KEY);

  if (!storedSession) {
    return null;
  }

  try {
    return JSON.parse(storedSession);
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function setSession(session) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    notifySessionChange();
  }
}

export function clearSession() {
  if (typeof window !== "undefined") {
    const hadSession = window.localStorage.getItem(SESSION_KEY) !== null;
    window.localStorage.removeItem(SESSION_KEY);

    if (hadSession) {
      notifySessionChange();
    }
  }
}

export function getCurrentUser() {
  return getSession()?.user || null;
}

export function hasAnyProfile(user, profiles) {
  if (!profiles || profiles.length === 0) {
    return true;
  }

  return profiles.includes(user?.profile);
}

export function addSessionListener(listener) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(SESSION_EVENT, listener);
  return () => window.removeEventListener(SESSION_EVENT, listener);
}
