import { useContext, useReducer, useState } from "react";
import { changePassword } from "../../api/user";
import { ContinueBtn } from "../../components/ContinueBtn";
import { Error } from "../../components/Error";
import { Expander } from "../../components/Exapander";
import { LabelledInput } from "../../components/LabelledInput";
import { OTPCreator } from "../../components/OTPCreator";
import { OTPManager } from "../../components/OTPManager";
import { AuthContext } from "../../providers/AuthProvider";

const initialState = {
  loading: false,
  error: null,
  currentPassword: "",
  newPassword: "",
  newPasswordConfirm: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "error":
      return { ...state, error: action.payload };
    case "loading":
      return { ...state, error: null, loading: true };
    case "loading_finished":
      return { ...state, loading: false };
    case "set_value":
      return { ...state, [action.key]: action.payload };
    default:
      return state;
  }
};

export const ChangePasswordForm = () => {
  document.title = 'Change Password';
  const [state, dispatch] = useReducer(reducer, initialState);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const { auth } = useContext(AuthContext);

  const handleSave = () => {
    if (state.newPassword !== state.newPasswordConfirm) {
      dispatch({ type: "error", payload: "New passwords do not match" });
      return;
    }
    dispatch({ type: "loading" });
    changePassword(state.currentPassword, state.newPassword)
      .then(() => {
        setPasswordChanged(true);
      })
      .catch((err) => {
        dispatch({ type: "error", payload: err.data.join("\n") });
      })
      .finally(() => dispatch({ type: "loading_finished" }));
  };

  return (
    <>
      <Expander title="Change password">
        <fieldset className="nhsuk-fieldset">
          <legend className="nhsuk-fieldset__legend nhsuk-fieldset__legend--l">
            <h1 className="nhsuk-fieldset__heading">Change password</h1>
          </legend>

          <div
            className={`nhsuk-form-group ${state.error ? "nhsuk-form-group--error" : ""}`}
          >
            {passwordChanged && (
              <div className="nhsuk-inset-text">
                <p>Password changed</p>
              </div>
            )}
            <Error>{state.error}</Error>
            <LabelledInput
              value={state.currentPassword}
              onInput={(e) =>
                dispatch({
                  type: "set_value",
                  key: "currentPassword",
                  payload: e.target.value,
                })
              }
              id="password"
              label="Current password"
              type="password"
            />
            <LabelledInput
              value={state.newPassword}
              onInput={(e) =>
                dispatch({
                  type: "set_value",
                  key: "newPassword",
                  payload: e.target.value,
                })
              }
              id="new-password"
              label="New password"
              type="password"
            />
            <LabelledInput
              value={state.newPasswordConfirm}
              onInput={(e) =>
                dispatch({
                  type: "set_value",
                  key: "newPasswordConfirm",
                  payload: e.target.value,
                })
              }
              id="new-password-confirm"
              label="Confirm new password"
              type="password"
            />
          </div>

          <ContinueBtn disabled={state.loading} onClick={handleSave}>
            Change password
          </ContinueBtn>
        </fieldset>
      </Expander>

      <Expander title="2-step verification">
        {auth.has_otp ? <OTPManager /> : <OTPCreator />}
      </Expander>
    </>
  );
};
