import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authService } from "../api/authService";
import { AUTH_EXPIRED_EVENT } from "../api/axiosClient";
import { tokenStorage } from "../utils/tokenStorage";
import type { AuthResponse, AuthUser, SignInRequest, SignUpRequest } from "../types";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  signIn: (data: SignInRequest) => Promise<AuthUser>;
  signUp: (data: SignUpRequest) => Promise<AuthUser>;
  signOut: () => void;
  updateUser: (changes: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function toUser(auth: AuthResponse): AuthUser {
  return { userId: auth.userId, name: auth.name, email: auth.email, role: auth.role };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = tokenStorage.get();
    return saved ? toUser(saved) : null;
  });

  const handleAuth = useCallback((auth: AuthResponse) => {
    tokenStorage.save(auth);
    const u = toUser(auth);
    setUser(u);
    return u;
  }, []);

  const signIn = useCallback(async (data: SignInRequest) => handleAuth(await authService.signIn(data)), [handleAuth]);
  const signUp = useCallback(async (data: SignUpRequest) => handleAuth(await authService.signUp(data)), [handleAuth]);

  const signOut = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
  }, []);

  // Keep the stored copy in sync when the profile changes (name/email)
  const updateUser = useCallback((changes: Partial<AuthUser>) => {
    const saved = tokenStorage.get();
    if (!saved) return;
    const next = { ...saved, ...changes };
    tokenStorage.save(next);
    setUser(toUser(next));
  }, []);

  // Sign out when the API reports the token is no longer valid
  useEffect(() => {
    const onExpired = () => setUser(null);
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === "ADMIN",
      isCustomer: user?.role === "CUSTOMER",
      signIn,
      signUp,
      signOut,
      updateUser,
    }),
    [user, signIn, signUp, signOut, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
