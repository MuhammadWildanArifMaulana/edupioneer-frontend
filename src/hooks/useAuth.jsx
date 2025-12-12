import { useState, useContext, createContext, useCallback } from "react";
import { authApi } from "../api/authApi";
import { storageUtils } from "../utils/storage";

const AuthContext = createContext(null);

// Internal hook that provides auth state and actions
const useProvideAuth = () => {
  const [user, setUser] = useState(() => {
    return storageUtils.getJSON("user");
  });

  const [token, setToken] = useState(() => {
    return storageUtils.getItem("token");
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.login(email, password);
      const payload = response.data?.data;
      const newToken = payload?.token;
      // user object is payload without token
      const { token, ...userData } = payload || {};

      storageUtils.setItem("token", newToken);
      storageUtils.setJSON("user", userData || null);

      setToken(newToken);
      setUser(userData || null);

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email, password, name, role) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.register(email, password, name, role);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    storageUtils.removeItem("token");
    storageUtils.removeItem("user");
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  const updateUser = useCallback((newUserData) => {
    try {
      if (!newUserData) {
        storageUtils.setJSON("user", null);
        setUser(null);
        return;
      }

      // Normalize avatar fields so components can read either name
      const avatarValue =
        newUserData.avatar_url ||
        newUserData.avatarUrl ||
        newUserData.avatar ||
        null;

      const normalized = {
        ...newUserData,
        avatar_url: avatarValue,
        avatarUrl: avatarValue,
        avatar: avatarValue,
      };

      storageUtils.setJSON("user", normalized);
      setUser(normalized);
    } catch (err) {
      console.warn("Failed to update auth user in storage", err);
    }
  }, []);

  return {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!token,
  };
};

// Provider that stores the shared auth instance in context
export const AuthProvider = ({ children }) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Hook for components to consume shared auth from context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export default useProvideAuth;
