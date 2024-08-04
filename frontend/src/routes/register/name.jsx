import { useContext, useReducer } from "react";
import { Error } from "../../components/Error";
import { ContinueBtn } from "../../components/ContinueBtn";
import { RegisterContext, RegisterType } from ".";
import { validateCredentials, validatePersonalInfo } from "../../api/user";
import { LabelledInput } from "../../components/LabelledInput";

const initialState = {
  hasError: false,
  email: "",
  loading: false,
  title: "Title",
  firstName: "",
  lastName: "",
  phone: "",
  postcode: "",

  titleError: "",
  firstNameError: "",
  lastNameError: "",
  phoneError: "",
  postcodeError: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        loading: true,
        hasError: false,
        titleError: "",
        firstNameError: "",
        lastNameError: "",
        phoneError: "",
        postcodeError: "",
      };
    case "set_error":
      return {
        ...state,
        hasError: true,
        [action.errorKey]: action.error,
      };
    case "set_values":
      return {
        ...state,
        ...action.payload,
      };
    case "loading_finished":
      return {
        ...state,
        loading: false,
      };
    default:
      return initialState;
  }
}

export function Name() {
  document.title = 'Register User';
  const { dispatch } = useContext(RegisterContext);
  const [internalState, internalDispatch] = useReducer(reducer, initialState);

  const handleContinue = () => {
    internalDispatch({ type: "loading" });

    validatePersonalInfo({
      title: internalState.title,
      firstName: internalState.firstName,
      lastName: internalState.lastName,
      phone: internalState.phone,
      postcode: internalState.postcode,
    })
      .then(() => {
        dispatch({
          type: RegisterType.SET_PERSONAL_INFO,
          payload: {
            title: internalState.title,
            firstName: internalState.firstName,
            lastName: internalState.lastName,
            phone: internalState.phone,
            postcode: internalState.postcode,
          },
        });
        dispatch({ type: RegisterType.NEXT_PAGE });
      })
      .catch((err) => {
        Object.entries(err).forEach(([key, value]) => {
          internalDispatch({
            type: "set_values",
            payload: {
              [key + "Error"]: value,
            },
          });
        });
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
          <h1 className="nhsuk-fieldset__heading">
            Name and contact information
          </h1>
        </legend>
        <div className="nhsuk-hint" id="date-of-birth-hint">
          These should be the same details you use for current prescriptions.
        </div>

        <div
          className={`nhsuk-form-group ${internalState.hasError ? "nhsuk-form-group--error" : ""}`}
        >
          <div className="nhsuk-form-group">
            <label className="nhsuk-label" htmlFor="title">
              Title <Error>{internalState.titleError}</Error>
            </label>
            <select
              value={internalState.title}
              onChange={(e) => {
                internalDispatch({
                  type: "set_values",
                  payload: { title: e.target.value },
                });
              }}
              className="nhsuk-select"
              id="title"
              name="title"
            >
              <option disabled value="Title">
                Title
              </option>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Miss">Miss</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <LabelledInput
            label="First name"
            id="first-name"
            error={internalState.firstNameError}
            value={internalState.firstName}
            onInput={(e) => {
              internalDispatch({
                type: "set_values",
                payload: { firstName: e.target.value },
              });
            }}
          />

          <LabelledInput
            label="Last name"
            id="last-name"
            error={internalState.lastNameError}
            value={internalState.lastName}
            onInput={(e) => {
              internalDispatch({
                type: "set_values",
                payload: { lastName: e.target.value },
              });
            }}
          />

          <LabelledInput
            label="Postcode"
            id="postcode"
            error={internalState.postcodeError}
            value={internalState.postcode}
            onInput={(e) => {
              internalDispatch({
                type: "set_values",
                payload: { postcode: e.target.value },
              });
            }}
          />

          <LabelledInput
            label="Phone number"
            id="phone"
            error={internalState.phoneError}
            value={internalState.phone}
            onInput={(e) => {
              internalDispatch({
                type: "set_values",
                payload: { phone: e.target.value },
              });
            }}
          />
        </div>
      </fieldset>
      <Error>{internalState.error}</Error>

      <ContinueBtn disabled={internalState.loading} onClick={handleContinue} />
    </>
  );
}
