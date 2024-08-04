export function Warning({ title, children }) {
  return (
    <div className="nhsuk-warning-callout">
      <h3 className="nhsuk-warning-callout__label">
        <span role="text">
          <span className="nhsuk-u-visually-hidden">Important: </span>
            {title}
        </span>
      </h3>
      <p>
        {children}
      </p>
    </div>
  );
}
