import { createContext, useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";

export const ProtectedRoute = () => {
  const location = useLocation();
  const { auth, isAuthenticated } = useContext(AuthContext);

  if (auth.loading) {
    return (
      <>
        <h1>Loading...</h1>
        <p>Please wait for the page to load.</p>
      </>
    );
  }

  if (!isAuthenticated) {
    console.log("redirecting...");
    return <Navigate to={"/login"} state={{ next: location.pathname }} />;
  }

  return <Outlet />;
};
