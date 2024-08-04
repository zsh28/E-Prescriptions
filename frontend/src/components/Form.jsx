import { useId } from "react";
import { ContinueBtn } from "./ContinueBtn";
import { Error } from "./Error";

// form component to create small forms used for changing details
export const Form = ({
  id,
  label,
  children,
  header = <h1>Change your details</h1>,
  error = null,
  loading = false,
  ...props
}) => {
  return (
    <>
      <form
        className={`nhsuk-form-group ${error ? "nhsuk-form-group--error" : ""}`}
      >
        {header}
        <label className="nhsuk-label" htmlFor={id}>
          {label}
        </label>
        <Error>{error}</Error>
        {children}

        <div>
          <ContinueBtn disabled={loading} onClick={props.onSubmit}>
            {props.btnText || "Save and continue"}
          </ContinueBtn>
        </div>
      </form>
    </>
  );
};

export const SingleInputForm = ({ label, ...props }) => {
  const id = useId();
  return (
    <Form id={id} label={label} {...props}>
      <input
        className="nhsuk-input full-width nhsuk-input--width-20"
        id={id}
        name={props.name || id}
        value={props.value}
        onInput={props.onInput}
        type={props.type}
        required
      />
    </Form>
  );
};

// im so sorry I just cant be bothered to go back and fix <Form /> in all the other pages
export const ProperForm = ({ label, children, onSubmit, error = null }) => {
  const id = useId();
  return (
    <>
      <form
        onSubmit={onSubmit}
        className={`nhsuk-form-group ${error ? "nhsuk-form-group--error" : ""}`}
      >
        <label className="nhsuk-label" htmlFor={id}>
          {label}
        </label>
        <Error>{error}</Error>
        {children}
      </form>
    </>
  );
};

// multi step form using page as an index into the children
// each child should have an onSubmit prop that handles moving onto the next page
// the continue button is disabled through the loading prop and errors are shown form-wide with the error prop
export const MultistepForm = ({
  page,
  children,
  error,
  loading = false,
}) => {
  return (
    <ProperForm error={error} onSubmit={children[page].props.onSubmit}>
      {children[page]}
      <br />
      <ContinueBtn disabled={loading}>{children[page].props.continuetext ?? "Save and continue"}</ContinueBtn>
    </ProperForm>
  );
};
