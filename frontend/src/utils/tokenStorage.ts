import type { AuthResponse } from "../types";

const KEY = "mtb_auth";

/** Reads the "exp" claim of a JWT. Returns 0 if the token cannot be decoded. */
function getExpiry(token: string): number {
  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return typeof json.exp === "number" ? json.exp * 1000 : 0;
  } catch {
    return 0;
  }
}

/**
 * The token is kept in localStorage so the session survives page reloads.
 * It is never logged, it is validated for expiry on every read, and it is
 * cleared on sign-out or on any 401 response from the API.
 */
export const tokenStorage = {
  save(auth: AuthResponse) {
    localStorage.setItem(KEY, JSON.stringify(auth));
  },

  get(): AuthResponse | null {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    try {
      const auth = JSON.parse(raw) as AuthResponse;
      if (!auth.token || getExpiry(auth.token) <= Date.now()) {
        this.clear();
        return null;
      }
      return auth;
    } catch {
      this.clear();
      return null;
    }
  },

  getToken(): string | null {
    return this.get()?.token ?? null;
  },

  clear() {
    localStorage.removeItem(KEY);
  },
};
