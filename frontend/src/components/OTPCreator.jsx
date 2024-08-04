import { useState, useReducer } from "react";
import { BigError } from "./BigError";
import { BackLink } from "./BackLink";
import { checkAndSaveOTP, createOTP } from "../api/auth";
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

export const OTPCreator = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [state, dispatch] = useReducer(reducer, intialState);
  const [otp, setOTP] = useState({});
  const [code, setCode] = useState("");
  const [bigError, setBigError] = useState(null);
  const [success, setSuccess] = useState(false);

  const nextPage = () => {
    dispatch({ type: "error", error: null });
    setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    dispatch({ type: "error", error: null });
    setCurrentPage(currentPage - 1);
  };

  const handleCreateOTP = (e) => {
    e.preventDefault();
    dispatch({ type: "loading" });
    createOTP()
      .then((res) => {
        setOTP(res);
        nextPage();
      })
      .catch((err) => {
        console.error(err);
        dispatch({ type: "error", error: err });
      })
      .finally(() => {
        dispatch({ type: "loading_finished" });
      });
  };

  const handleOTPSubmit = (e) => {
    e.preventDefault();
    checkAndSaveOTP(otp.secret, code)
      .then((res) => {
              setSuccess(true)
      })
      .catch((err) => {
        if (err.data.secret) {
          dispatch({ type: "error", error: err.data.secret });
          return;
        }
        if (err.data.code) {
          dispatch({ type: "error", error: err.data.code });
          return;
        }
        setBigError();
      });
  };

  if (success) {
    return (
      <div className="nhsuk-inset-text">
        <span className="nhsuk-u-visually-hidden">Information: </span>
        <p>One time password has been added to your account</p>
      </div>
    );
  }

  return (
    <>
      {bigError && <BigError>{bigError}</BigError>}
      <MultistepForm
        page={currentPage}
        error={state.error}
        loading={state.loading}
      >
        <div onSubmit={handleCreateOTP} continuetext="Create OTP">
          <h2>2-step verification</h2>
          <p>
            2-step veritifcation adds an extra layer of security to your
            account. In addition to your regular password, you will also be
            asked for a code which is generated from a secret. This is known as
            a one-time password (OTP).
          </p>
        </div>

        <div
          onSubmit={(e) => {
            e.preventDefault();
            nextPage();
          }}
          continuetext="Next"
        >
          <p>
            Scan the QR code below using your authenticator app. Alternatively,
            copy and paste the following text:
          </p>
          <pre>{otp.totp}</pre>
          <img src={`data:image/jpeg;base64,${otp.base64}`} alt={otp.totp} />
        </div>

        <div onSubmit={handleOTPSubmit}>
          <BackLink onClick={prevPage} />
          <LabelledInput
            value={code}
            onInput={(e) => setCode(e.target.value)}
            type="number"
            label="Enter the code your app has generated"
          />
        </div>
      </MultistepForm>
    </>
  );
};
