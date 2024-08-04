import { useContext, useReducer } from "react";
import { Error } from "../../components/Error";
import { ContinueBtn } from "../../components/ContinueBtn";
import { RegisterContext, RegisterType } from ".";
import { validateCredentials } from "../../api/user";

const initialState = {
  hasError: false,
  emailError: null,
  passwordError: null,
  error: null,
  email: "",
  loading: false,
  password: "",
  confirmPassword: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        loading: true,
        hasError: false,
        error: null,
        passwordError: null,
        emailError: null,
      };
    case "error":
      return {
        ...state,
        hasError: true,
        error: action.payload,
      };
    case "email_error":
      return {
        ...state,
        hasError: true,
        emailError: action.payload,
      };
    case "password_error":
      return {
        ...state,
        hasError: true,
        passwordError: action.payload,
      };
    case "loading_finished":
      return {
        ...state,
        loading: false,
      };
    case "set_email":
      return { ...state, email: action.payload };
    case "set_password":
      return { ...state, password: action.payload };
    case "set_confirm_password":
      return { ...state, confirmPassword: action.payload };
    default:
      return initialState;
  }
}

export function Credentials() {
  document.title = 'Register User';
  const { dispatch } = useContext(RegisterContext);
  const [internalState, internalDispatch] = useReducer(reducer, initialState);

  const validatePasswordConfirm = () => {
    if (internalState.password !== internalState.confirmPassword) {
      internalDispatch({
        type: "password_error",
        payload: "Passwords do not match",
      });
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    internalDispatch({ type: "loading" });
    const passwordsMatch = validatePasswordConfirm();

    validateCredentials({
      email: internalState.email,
      password: internalState.password,
    })
      .then(() => {
        if (!passwordsMatch) {
          return;
        }
        dispatch({
          type: RegisterType.SET_CREDENTIALS,
          email: internalState.email,
          password: internalState.password,
        });
        dispatch({ type: RegisterType.NEXT_PAGE });
      })
      .catch((err) => {
        if (err.email) {
          internalDispatch({
            type: "email_error",
            payload: err.email.join("\n"),
          });
        }
        if (err.password) {
          internalDispatch({
            type: "password_error",
            payload: err.password.join("\n"),
          });
        }
      })
      .finally(() => {
        internalDispatch({ type: "loading_finished" });
      });
  };

  return (
    <>
      <fieldset
        className="nhsuk-fieldset"
        aria-describedby="date-of-birth-hint"
        role="group"
      >
        <legend className="nhsuk-fieldset__legend nhsuk-label--l">
          <h1 className="nhsuk-fieldset__heading">Create login credentials</h1>
        </legend>
        <div className="nhsuk-hint" id="date-of-birth-hint">
          You will use these each time you login to the service
        </div>

        <div
          className={`nhsuk-form-group ${internalState.hasError ? "nhsuk-form-group--error" : ""}`}
        >
          <label className="nhsuk-label" htmlFor="email">
            E-Mail
          </label>
          <Error>{internalState.emailError}</Error>
          <input
            className="nhsuk-input full-width nhsuk-input--width-20"
            id="email"
            name="email"
            type="email"
            value={internalState.email}
            onInput={(e) => {
              internalDispatch({ type: "set_email", payload: e.target.value });
            }}
          />

          <label className="nhsuk-label" htmlFor="password">
            Password
          </label>
          <Error>{internalState.passwordError}</Error>
          <input
            className="nhsuk-input full-width nhsuk-input--width-10"
            id="password"
            name="password"
            type="password"
            value={internalState.password}
            onInput={(e) =>
              internalDispatch({
                type: "set_password",
                payload: e.target.value,
              })
            }
          />

          <label className="nhsuk-label" htmlFor="confirm-password">
            Confirm Password
          </label>
          <input
            className="nhsuk-input full-width nhsuk-input--width-10"
            id="confirm-password"
            name="confirm-password"
            type="password"
            value={internalState.confirmPassword}
            onInput={(e) =>
              internalDispatch({
                type: "set_confirm_password",
                payload: e.target.value,
              })
            }
          />
        </div>
      </fieldset>
      <Error>{internalState.error}</Error>

      <ContinueBtn disabled={internalState.loading} onClick={handleContinue} />
    </>
  );
}
