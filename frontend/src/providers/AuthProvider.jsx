import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { authenticate } from "../api/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const initialState = {
  userId: null,
  groups: [],
  stayLoggedIn: true,
  loading: true,
  firstName: null,
  lastName: null,
  has_otp: false,
};

export const AuthContext = createContext(initialState);

export const AuthProvider = ({ children }) => {
  const [token, setToken, setStateToken] = useLocalStorage("token");
  const [auth, setAuth] = useState(initialState);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  const conditionalSetToken = (newToken) => {
    if (auth.stayLoggedIn) {
      setToken(newToken);
    } else {
      setStateToken(newToken);
    }
  };

  useEffect(() => {
    if (token != null) {
      console.log("auth/ because token=", token);
      // authenticate the token
      authenticate(token)
        .then((res) => setAuth({ ...auth, ...res, loading: false }))
        .catch((e) => {
          console.error("Failed to authenticate:", e);
          setAuth({ ...auth, loading: false });
          setToken(null);
        });
    } else {
      setAuth({ ...auth, loading: false });
    }
  }, []);

  useEffect(() => {
    setIsAuthenticated(!!token);
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Token ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token, setIsAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        isAuthenticated,
        token,
        setToken: conditionalSetToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
