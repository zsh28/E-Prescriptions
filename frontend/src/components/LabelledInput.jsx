import { useId } from "react";
import { Error } from "../components/Error";

export const LabelledInput = ({ label, error = null, ...props }) => {
    const id = useId();

  return (
    <>
      <label className="nhsuk-label" htmlFor={id}>
        {label}
        {error && <Error>{error}</Error>}
      </label>
      <input
        className="nhsuk-input full-width nhsuk-input--width-20"
        id={id}
        name={props.name || id}
        {...props}
      />
    </>
  );
};
