import { createContext, useContext, useState, useCallback } from "react";
import { useToast } from "@chakra-ui/react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };
  const fullUrl = `${API_BASE_URL}${url}`;
  const res = await fetch(fullUrl, config);
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ message: `Request failed ${res.status}` }));
    throw new Error(err.message || "Request failed");
  }
  if (res.status === 204 || res.headers.get("content-length") === "0")
    return null;
  return res.json();
};

export const AuthProvider = ({ children }) => {
  const toast = useToast();
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const login = useCallback(
    async (email, password) => {
      try {
        const data = await apiRequest("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        // backend döndüğü varsayılan shape: { success, data: { token, ... } }
        const payload = data?.data || data;
        if (payload?.token) {
          localStorage.setItem("token", payload.token);
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: payload.id,
              name: payload.name,
              email: payload.email,
              isAdmin: payload.isAdmin,
            })
          );
          setUser({
            id: payload.id,
            name: payload.name,
            email: payload.email,
            isAdmin: payload.isAdmin,
          });
          toast({
            title: "Giriş başarılı",
            status: "success",
            duration: 2500,
            isClosable: true,
          });
          return { ok: true, user: payload };
        }
        throw new Error("Beklenmeyen sunucu yanıtı");
      } catch (err) {
        toast({
          title: "Giriş başarısız",
          description: err.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        return { ok: false, error: err.message };
      }
    },
    [toast]
  );

  const getProfile = useCallback(async () => {
    try {
      const data = await apiRequest("/auth/me");
      const payload = data?.data || data;
      if (payload) {
        setUser({
          id: payload.id,
          name: payload.name,
          email: payload.email,
          isAdmin: payload.isAdmin,
        });
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: payload.id,
            name: payload.name,
            email: payload.email,
            isAdmin: payload.isAdmin,
          })
        );
        return { ok: true, user: payload };
      }
      return { ok: false };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }, []);

  const register = useCallback(
    async (name, email, password) => {
      try {
        const data = await apiRequest("/auth/register", {
          method: "POST",
          body: JSON.stringify({ name, email, password }),
        });
        const payload = data?.data || data;
        if (payload?.token) {
          localStorage.setItem("token", payload.token);
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: payload.id,
              name: payload.name,
              email: payload.email,
              isAdmin: payload.isAdmin,
            })
          );
          setUser({
            id: payload.id,
            name: payload.name,
            email: payload.email,
            isAdmin: payload.isAdmin,
          });
          toast({
            title: "Kayıt başarılı",
            status: "success",
            duration: 2500,
            isClosable: true,
          });
          return { ok: true, user: payload };
        }
        throw new Error("Beklenmeyen sunucu yanıtı");
      } catch (err) {
        toast({
          title: "Kayıt başarısız",
          description: err.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        return { ok: false, error: err.message };
      }
    },
    [toast]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast({
      title: "Oturum kapatıldı",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  }, [toast]);

  const updateProfile = useCallback(
    async (updates) => {
      try {
        const data = await apiRequest("/auth/me", {
          method: "PUT",
          body: JSON.stringify(updates),
        });
        const payload = data?.data || data;
        if (payload?.token) {
          // update token and user
          localStorage.setItem("token", payload.token);
          const userObj = {
            id: payload.id,
            name: payload.name,
            email: payload.email,
            isAdmin: payload.isAdmin,
          };
          localStorage.setItem("user", JSON.stringify(userObj));
          setUser(userObj);
          toast({
            title: "Profil güncellendi",
            status: "success",
            duration: 2500,
            isClosable: true,
          });
          return { ok: true, user: userObj };
        }
        return { ok: false };
      } catch (err) {
        toast({
          title: "Güncelleme başarısız",
          description: err.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        return { ok: false, error: err.message };
      }
    },
    [toast]
  );

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, getProfile, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
