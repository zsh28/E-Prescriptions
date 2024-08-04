import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Link } from "react-router-dom";

const defaultNavbar = {
  "Home": "/",
  "About": "/about",
};

const authNavbar = {
    "Dashboard": "/dashboard",
    "Logout": "/logout",
};

const unAuthNavbar = {
    "Register": "/register",
    "Sign in": "/login",
};

export const Navbar = () => {
  const { isAuthenticated } = useContext(AuthContext);

    const navbar = {...defaultNavbar, ...(isAuthenticated ? authNavbar : unAuthNavbar)}

  return (
    <div className="nhsuk-navigation-container">
      <nav
        className="nhsuk-navigation"
        id="header-navigation"
        role="navigation"
        aria-label="Primary navigation"
      >
        <ul className="nhsuk-header__navigation-list">
          {Object.entries(navbar).map(([text, href]) => (
            <li key={href} className="nhsuk-header__navigation-item">
              <Link className="nhsuk-header__navigation-link" to={href}>
                {text}
              </Link>
            </li>
          ))}

          {/* these are shown on mobile / small screens only */}
          <li className="nhsuk-header__navigation-item nhsuk-header__navigation-item--home">
            <a className="nhsuk-header__navigation-link" href="/">
              Home
            </a>
          </li>

          <li className="nhsuk-mobile-menu-container">
            <button
              className="nhsuk-header__menu-toggle nhsuk-header__navigation-link"
              id="toggle-menu"
              aria-expanded="false"
            >
              <span className="nhsuk-u-visually-hidden">Browse</span>
              More
              <svg
                className="nhsuk-icon nhsuk-icon__chevron-down"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M15.5 12a1 1 0 0 1-.29.71l-5 5a1 1 0 0 1-1.42-1.42l4.3-4.29-4.3-4.29a1 1 0 0 1 1.42-1.42l5 5a1 1 0 0 1 .29.71z"></path>
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};
