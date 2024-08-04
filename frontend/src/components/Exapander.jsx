export const Expander = ({ title, children }) => {
  return (
    <details className="nhsuk-details nhsuk-expander">
      <summary className="nhsuk-details__summary">
        <span className="nhsuk-details__summary-text">
            {title}
        </span>
      </summary>
      <div className="nhsuk-details__text">
        {children}
      </div>
    </details>
  );
};
