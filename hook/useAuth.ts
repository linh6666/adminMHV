import { useState, useEffect } from "react";
import { loginUser } from "../api/apilogin";
import { getUserInfo } from "../api/apiLoginusename";

interface User {
  full_name: string;
  email: string;
}

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getUser = async (token: string) => {
    try {
      const fetchedUser = await getUserInfo(token);
      setUser(fetchedUser);
      setIsLoggedIn(true);
      setError(null);
    } catch (err) {
      console.error("Fetch user error:", err);
      setUser(null);
      setIsLoggedIn(false);
      setError("Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      getUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const { access_token } = await loginUser(username, password);
      localStorage.setItem("access_token", access_token);
      await getUser(access_token); // Gọi để lấy thông tin user ngay
    } catch (err) {
      console.error("Login error:", err);
      setUser(null);
      setIsLoggedIn(false);
      setError("Login failed.");
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    setIsLoggedIn(false);
    setError(null);
  };

  return {
    user,
    isLoggedIn,
    login,
    logout,
    error,
    loading,
  };
};

export default useAuth;
