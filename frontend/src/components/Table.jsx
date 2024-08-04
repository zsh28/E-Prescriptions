import React from "react";

export const Row = ({ children, headings }) => {
  return (
    <tr role="row" className="nhsuk-table__row">
      {React.Children.map(children, (child, index) => (
        <td className="nhsuk-table__cell">
          {
            <span className="nhsuk-table-responsive__heading">
              {headings[index]}{" "}
            </span>
          }{" "}
          {child}
        </td>
      ))}
    </tr>
  );
};

export const Table = ({ caption, headings, label, children, ...props }) => {
  return (
    <table className="nhsuk-table nhsuk-table-responsive">
      <caption className="nhsuk-table__caption">{caption}</caption>
      <thead className="nhsuk-table__head">
        <tr role="row">
          {headings.map((heading) => (
            <th key={heading} role="columnheader" className="" scope="col">
              {heading}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="nhsuk-table__body">
        {React.Children.map(children, (child) => {
          return React.cloneElement(child, { headings });
        })}
      </tbody>
    </table>
  );
};
