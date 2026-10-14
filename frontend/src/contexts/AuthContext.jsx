import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthContext } from "./authContextValue";
import {
  clearAuthToken,
  fetchCurrentUser,
  getAuthToken,
  loginUser,
  setAuthToken,
} from "../services/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(getAuthToken()));
  const [authError, setAuthError] = useState("");

  const refreshUser = useCallback(async () => {
    if (!getAuthToken()) {
      setUser(null);
      setAuthError("");
      setIsLoading(false);
      return null;
    }

    setIsLoading(true);
    setAuthError("");

    try {
      const response = await fetchCurrentUser();
      setUser(response.user);
      return response.user;
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        clearAuthToken();
      }
      setUser(null);
      setAuthError(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    queueMicrotask(() => {
      if (isMounted) {
        refreshUser();
      }
    });
    window.addEventListener("storage", refreshUser);

    return () => {
      isMounted = false;
      window.removeEventListener("storage", refreshUser);
    };
  }, [refreshUser]);

  const login = useCallback(async (email, password) => {
    const response = await loginUser(email, password);
    if (!response?.token) {
      throw new Error("The server did not return an access token.");
    }

    setAuthToken(response.token);
    setAuthError("");

    try {
      const currentUser = await fetchCurrentUser();
      setUser(currentUser.user);
      return currentUser.user;
    } catch (error) {
      clearAuthToken();
      setUser(null);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    clearAuthToken();
    setUser(null);
    setAuthError("");
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      authError,
      login,
      logout,
      refreshUser,
    }),
    [user, isLoading, authError, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
