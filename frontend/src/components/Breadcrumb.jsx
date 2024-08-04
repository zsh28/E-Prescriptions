import { Link } from "react-router-dom";

export const BreadcrumbLink = ({ href, children }) => {
  return (
    <Link className="nhsuk-breadcrumb__link" to={href}>
      {children}
    </Link>
  );
};

export const Breadcrumb = ({ children }) => {
  return (
    <nav className="nhsuk-breadcrumb" aria-label="Breadcrumb">
      <div className="nhsuk-width-container">
        <ol className="nhsuk-breadcrumb__list">
          {children.map((link, index) => (
            <li key={index} className="nhsuk-breadcrumb__item">{link}</li>
          ))}
        </ol>
      </div>
    </nav>
  );
};
