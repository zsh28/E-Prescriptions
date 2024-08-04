import { Link } from "react-router-dom";

export const Card = ({ summary, children, href }) => {
  return (
    <li className="nhsuk-grid-column-one-half nhsuk-card-group__item">
      <div className="nhsuk-card nhsuk-card--clickable">
        <div className="nhsuk-card__content nhsuk-card__content--primary">
          <h2 className="nhsuk-card__heading nhsuk-heading-m">
            <Link className="nhsuk-card__link" to={href}>
              {children}
            </Link>
          </h2>
          <p className="nhsuk-card__description">{summary}</p>

          <svg
            className="nhsuk-icon nhsuk-icon nhsuk-icon__chevron-right-circle"
            xmlns="http://www.w3.org/2000/svg"
            width="27"
            height="27"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="13.333" cy="13.333" r="13.333" fill="" />
            <g
              data-name="Group 1"
              fill="none"
              stroke="#fff"
              strokeLinecap="round"
              strokeMiterlimit="10"
              strokeWidth="2.667"
            >
              <path d="M15.438 13l-3.771 3.771" />
              <path data-name="Path" d="M11.667 9.229L15.438 13" />
            </g>
          </svg>
        </div>
      </div>
    </li>
  );
};
