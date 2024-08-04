import { useId } from "react";

export const LabelledSelect = ({ label, children, ...props }) => {
  const id = useId();

  return (
    <>
      <label className="nhsuk-label" htmlFor={id}>
        {label}
      </label>
      <select
        className="nhsuk-select"
        id={id}
        name={props.name || id}
        {...props}
      >
        {children}
      </select>
    </>
  );
};
