import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, initialState } from "../providers/AuthProvider";

export const Logout = () => {
  document.title = 'Log Out';
  const { auth, setAuth, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setAuth({ ...initialState, loading: false });
    setToken(null);
  }, [setAuth, setToken]);

  useEffect(() => {
    if (!auth.userId) {
      navigate("/login");
    }
  }, [auth.userId, navigate]);

  return (
    <>
      <h1>Logging out...</h1>
      <p>Please wait whilst you are logged out.</p>
    </>
  );
};
