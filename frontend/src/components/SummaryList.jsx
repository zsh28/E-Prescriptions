export const SummaryList = ({ items }) => {
  return (
    <>
      <dl className="nhsuk-summary-list">
        {items.map(({ key, value, action }) => (
          <div key={key} className="nhsuk-summary-list__row">
            <dt className="nhsuk-summary-list__key">{key}</dt>
            <dd className="nhsuk-summary-list__value">{value}</dd>

            <dd className="nhsuk-summary-list__actions">
              <div>{action}</div>
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
};
