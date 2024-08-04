import { useId } from "react";

export const Checkbox = ({ children, ...props }) => {
  const id = useId();
  return (
    <div className="nhsuk-checkboxes__item">
      <input
        {...props}
        id={id}
        className="nhsuk-checkboxes__input"
        type="checkbox"
      />
      <label htmlFor={id} className="nhsuk-label nhsuk-checkboxes__label">
        {children}
      </label>
    </div>
  );
};
