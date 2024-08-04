import { SingleInputForm } from "./Form";
import { checkPassword } from "../api/auth";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, initialState } from "../providers/AuthProvider";
import { deleteUser } from "../api/user";

export const DeleteAccount = () => {
  const { auth, setAuth, setToken } = useContext(AuthContext);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    checkPassword(password)
      .then(() => {
        deleteUser(auth.userId)
          .then((res) => {
            setAuth(initialState);
            setToken(null);
            setTimeout(() => {
              navigate("/");
            }, 0);
          })
          .catch((err) => {
            setError("Something went wrong");
            console.error(error);
          });
      })
      .catch((err) => {
        if (err.status === 401) {
          setError(err.data.password);
          return;
        }
        setError("Something went wrong");
        console.error(error);
      });
  };

  return (
    <SingleInputForm
      error={error}
      value={password}
      onInput={(e) => setPassword(e.target.value)}
      onSubmit={handlePasswordSubmit}
      header=<h1>Delete your account</h1>
      label="Enter your password"
      type="password"
      btnText="Delete my account"
    />
  );
};
