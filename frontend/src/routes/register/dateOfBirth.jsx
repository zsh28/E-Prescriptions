import { useContext, useReducer } from "react";
import { RegisterContext, RegisterType } from ".";
import { register, validateDateOfBirth } from "../../api/user";
import { ContinueBtn } from "../../components/ContinueBtn";
import { Error } from "../../components/Error";

const initialState = {
  day: "",
  month: "",
  year: "",
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "error":
      return { ...state, error: action.payload, loading: false };
    case "loading":
      return { ...state, error: null, loading: true };
    case "loading_finished":
      return { ...state, loading: false };
    case "set_year":
      return { ...state, year: action.payload };
    case "set_month":
      return { ...state, month: action.payload };
    case "set_day":
      return { ...state, day: action.payload };
    default:
      return initialState;
  }
}

const DateInput = ({ id, label, ...props }) => {
  return (
    <div className="nhsuk-date-input__item">
      <div className="nhsuk-form-group">
        <label className="nhsuk-label nhsuk-date-input__label" htmlFor={id}>
          {label}
        </label>
        <input
          className="nhsuk-input nhsuk-date-input__input nhsuk-input--width-2"
          id={id}
          name={id}
          type="text"
          pattern="[0-9]*"
          inputMode="numeric"
          {...props}
        />
      </div>
    </div>
  );
};

export const DateOfBirth = () => {
  
  const { state, dispatch } = useContext(RegisterContext);
  const [internalState, internalDispatch] = useReducer(reducer, initialState);

  const handleContinue = () => {
    document.title = 'Register User';
    internalDispatch({ type: "loading" });
    // validate internally before moving on in the register page
    // can get away with no internal validation here :P
    validateDateOfBirth(
      internalState.year,
      internalState.month,
      internalState.day,
    )
      .then(() => {
        internalDispatch({ type: "loading_finished" });
        dispatch({
          type: RegisterType.SET_DATE_OF_BIRTH,
          payload: `${internalState.year}-${internalState.month}-${internalState.day}`,
        });
        dispatch({ type: RegisterType.NEXT_PAGE });
      })
      .catch((err) => {
        internalDispatch({ type: "error", payload: err });
        console.log("register error:", err);
      });
  };

  return (
    <>
      <div
        className={`nhsuk-form-group ${internalState.error ? "nhsuk-form-group--error" : ""}`}
      >
        <fieldset
          className="nhsuk-fieldset"
          aria-describedby="date-of-birth-hint"
          role="group"
        >
          <legend className="nhsuk-fieldset__legend nhsuk-label--l">
            <h1 className="nhsuk-fieldset__heading">
              What is your date of birth?
            </h1>
          </legend>
          <div className="nhsuk-hint" id="date-of-birth-hint">
            For date-of-birth, 15 3 1984
          </div>

          <Error>{internalState.error}</Error>

          <div className="nhsuk-date-input" id="date-of-birth">
            <DateInput
              id={"date-of-birth-day"}
              label={"Day"}
              value={internalState.day}
              onInput={(e) =>
                internalDispatch({ type: "set_day", payload: e.target.value })
              }
            />
            <DateInput
              id={"date-of-birth-month"}
              label={"Month"}
              value={internalState.month}
              onInput={(e) =>
                internalDispatch({ type: "set_month", payload: e.target.value })
              }
            />
            <DateInput
              id={"date-of-birth-year"}
              label={"Year"}
              value={internalState.year}
              onInput={(e) =>
                internalDispatch({ type: "set_year", payload: e.target.value })
              }
            />
          </div>
        </fieldset>
      </div>

      <ContinueBtn disabled={internalState.loading} onClick={handleContinue} />
    </>
  );
};
