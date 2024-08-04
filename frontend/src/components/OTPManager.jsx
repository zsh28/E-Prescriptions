import { useState, useReducer } from "react";
import { checkAndRemoveOTP, checkPassword } from "../api/auth";
import { MultistepForm } from "./Form";
import { LabelledInput } from "./LabelledInput";

const reducer = (state, action) => {
  switch (action.type) {
    case "loading":
      return { ...state, loading: true, error: null };
    case "loading_finished":
      return { ...state, loading: false };
    case "error":
      return { ...state, error: action.error };
    default:
      return state;
  }
};

const intialState = {
  loading: false,
  error: null,
};

export const OTPManager = () => {
  const [state, dispatch] = useReducer(reducer, intialState);
  const [currentPage, setCurrentPage] = useState(0);
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [success, setSuccess] = useState(false);

  const nextPage = (e) => {
    if (e) {
      e.preventDefault();
    }
    dispatch({ type: "error", error: null });
    setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    dispatch({ type: "error", error: null });
    setCurrentPage(currentPage - 1);
  };

  const handleSubmitPassword = (e) => {
    e.preventDefault();
    checkPassword(password)
      .then((res) => {
        nextPage();
      })
      .catch((err) => {
        if (err.data.password) {
          dispatch({ type: "error", error: err.data.password });
          return;
        }
        dispatch({ type: "error", error: JSON.stringify(err.data) });
      });
  };

  const handleSubmitOTP = (e) => {
    e.preventDefault();
    checkAndRemoveOTP(otp)
      .then((res) => {
        setSuccess(true);
      })
      .catch((err) => {
        if (err.data.password) {
          dispatch({ type: "error", error: err.data.password });
          return;
        }
        dispatch({ type: "error", error: JSON.stringify(err.data) });
      });
  };

  if (success) {
    return (
      <div className="nhsuk-inset-text">
        <span className="nhsuk-u-visually-hidden">Information: </span>
        <p>2-step verification has been removed</p>
      </div>
    );
  }

  return (
    <>

      <MultistepForm
        page={currentPage}
        error={state.error}
        loading={state.loading}
      >
        <div
          onSubmit={nextPage}
          continuetext="Remove 2-step verification"
        >

      <h1>OTP manager</h1>

      <p>You already have 2-step verification enabled on your account.</p>
      <p>
        You may remove this by using the form below. You will need your
        authenticator app and password.
      </p>
          </div>

        <div onSubmit={handleSubmitPassword}>
          <p>To continue with removing your 2-step verification, enter your password.</p>
          <LabelledInput
            value={password}
            onInput={(e) => setPassword(e.target.value)}
            label="Enter your password"
            type="password"
            required
          />
        </div>

        <div onSubmit={handleSubmitOTP}>
          <p>Finally, please enter the code currently displayed in your authenticator app.</p>
          <LabelledInput
            value={otp}
            onInput={(e) => setOtp(e.target.value)}
            label="Enter your one time password (OTP)"
            type="number"
            required
          />
        </div>
      </MultistepForm>
    </>
  );
};
