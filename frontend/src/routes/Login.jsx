import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { BackLink } from "../components/BackLink";
import { ContinueBtn } from "../components/ContinueBtn";
import { Error } from "../components/Error";
import { AuthContext } from "../providers/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../styles/LoginPage.css";
import { LabelledInput } from "../components/LabelledInput";
import { BigError } from "../components/BigError";

const initialState = {
  loading: false,
  error: null,
  emailError: null,
  passwordError: null,
  email: "",
  password: "",
  otpCode: "",
  otpError: "",
};

function loginReducer(state, action) {
  switch (action.type) {
    case "loading_finished":
      return {
        ...state,
        loading: false,
      };
    case "login_loading":
      return {
        ...state,
        error: null,
        emailError: null,
        passwordError: null,
        loading: true,
      };
    case "login_error":
      return {
        ...state,
        error: action.error,
        emailError: action.emailError,
        passwordError: action.passwordError,
        loading: false,
      };
    case "otp_error":
      return {
        ...state,
        otpError: action.error,
        loading: false,
      };
    case "set_otp":
      return {
        ...state,
        otpCode: action.code,
      };
    case "set_email":
      return { ...state, email: action.payload };
    case "set_password":
      return { ...state, password: action.payload };
    default:
      return state;
  }
}

export const LoginPage = () => {
  document.title = "Sign In";
  const location = useLocation();
  const { next, registerSuccess } = location.state ?? {};

  const [state, dispatch] = useReducer(loginReducer, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { auth, setAuth, setToken } = useContext(AuthContext);
  const emailRef = useRef(null);
  const [otpRequired, setOtpRequred] = useState(false);
  const [bigError, setBigError] = useState(null);

  useEffect(() => {
    if (auth.token) {
      navigate(next ?? "/dashboard");
    } else {
      emailRef.current?.focus();
    }
  }, [auth.token, navigate, next]);

  const handleLogin = async (event) => {
    event.preventDefault();
    let emailError = null;
    let passwordError = null;

    if (!state.email) {
      emailError = "Email is required";
    }
    if (!state.password) {
      passwordError = "Password is required";
    }

    if (emailError || passwordError) {
      dispatch({
        type: "login_error",
        emailError,
        passwordError,
        error: "Please fill in all required fields",
      });
      return;
    }

    dispatch({ type: "login_loading" });
    try {
      const res = await login(state.email, state.password);
      setAuth(res);
      setToken(res.token);
    } catch (err) {
      if (err.status === 400) {
        // bad request, maybe a OTP is required
        if (err.data.code) {
          // this account has a OTP
          setOtpRequred(true);
          return;
        }
      }

      if (err.status === 500) {
        // something went very bad
        setBigError("Sorry, but something went wrong trying to sign in.");
        console.error("Login error", err);
        return;
      }

      dispatch({
        type: "login_error",
        emailError: err.data.username,
        passwordError: err.data.password,
        error: err.data.non_field_errors,
      });
      setToken(null);
    } finally {
      dispatch({ type: "loading_finished" });
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(state.email, state.password, state.otpCode);
      setAuth(res);
      setToken(res.token);
    } catch (err) {
      if (err.status === 401) {
        dispatch({ type: "otp_error", error: err.data.code });
        console.log("otp error", err.data.code);
        return;
      }
      console.error(err);
    }
  };

  if (otpRequired) {
    return (
      <>
        <BackLink
          onClick={() => {
            dispatch({ type: "loading_finished" });
            setOtpRequred(false);
          }}
        />
        <form onSubmit={handleOTPSubmit}>
          <h1>2-step verification</h1>
          <p>
            This account is setup with 2-step verification. Please enter the one
            time password (OTP) displayed on your authenticator app:
          </p>

          <div
            className={`nhsuk-form-group ${state.error || state.otpError ? "nhsuk-form-group--error" : ""}`}
          >
            <LabelledInput
              onInput={(e) =>
                dispatch({ type: "set_otp", code: e.target.value })
              }
              label="One time password"
              type="number"
              error={state.otpError}
            />
          </div>
          <ContinueBtn>Continue</ContinueBtn>
        </form>
      </>
    );
  }

  return (
    <>
      <BackLink />
      {bigError && <BigError>{bigError}</BigError>}

      {registerSuccess && (
        <div className="nhsuk-inset-text">
          <span className="nhsuk-u-visually-hidden">Information: </span>
          <p>Registration successfull. You can now sign in.</p>
        </div>
      )}

      <form onSubmit={handleLogin} className="login-form">
        <h1 className="nhsuk-heading-xl">Sign in to use the service</h1>
        <p className="nhsuk-body">
          Please sign in using your email address and the password you used to
          register.
        </p>

        <div
          className={`nhsuk-form-group ${state.error || state.emailError || state.passwordError ? "nhsuk-form-group--error" : ""}`}
        >
          <label className="nhsuk-label" htmlFor="email">
            E-Mail
          </label>

          <Error>{state.emailError}</Error>
          <input
            className="nhsuk-input full-width nhsuk-input--width-20"
            id="email"
            name="email"
            type="email"
            ref={emailRef}
            onInput={(e) =>
              dispatch({ type: "set_email", payload: e.target.value })
            }
            required
          />

          <div className="nhsuk-form-group password-group">
            <label className="nhsuk-label" htmlFor="password">
              Password
            </label>
            <Error>{state.passwordError}</Error>
            <div className="password-input-container">
              <input
                className="nhsuk-input"
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                onInput={(e) =>
                  dispatch({ type: "set_password", payload: e.target.value })
                }
                required
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="password-toggle"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            <div className="forgot-password-link">
              <a href="/reset-password" className="forgot-link">
                Forgot Password?
              </a>
            </div>
          </div>

          <div className="nhsuk-checkboxes__item">
            <input
              className="nhsuk-checkboxes__input"
              id="stayLoggedIn"
              name="stayLoggedIn"
              type="checkbox"
              defaultChecked={auth.stayLoggedIn}
              onInput={(e) =>
                setAuth({ ...auth, stayLoggedIn: e.target.checked })
              }
            />
            <label
              className="nhsuk-label nhsuk-checkboxes__label"
              htmlFor="stayLoggedIn"
            >
              Stay logged in
            </label>
          </div>

          <Error>{state.error}</Error>
        </div>

        <button className="nhsuk-button" type="submit" disabled={state.loading}>
          Continue
        </button>
      </form>
    </>
  );
};
