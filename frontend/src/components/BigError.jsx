export const BigError = ({ children }) => {
  return (
    <div
      className="nhsuk-error-summary"
      aria-labelledby="error-summary-title"
      role="alert"
      tabIndex="-1"
    >
      <h2 className="nhsuk-error-summary__title" id="error-summary-title">
        There is a problem
      </h2>
      <div className="nhsuk-error-summary__body">
        {children}
      </div>
    </div>
  );
};
