import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer role="contentinfo">
      <div className="nhsuk-footer-container">
        <div className="nhsuk-width-container">
          <h2 className="nhsuk-u-visually-hidden">Support links</h2>
          <div className="nhsuk-footer">
            <ul className="nhsuk-footer__list">
              <li className="nhsuk-footer__list-item nhsuk-footer-default__list-item">
                <Link className="nhsuk-footer__list-item-link" to="/about">About</Link>
              </li>
              <li className="nhsuk-footer__list-item nhsuk-footer-default__list-item">
                <Link className="nhsuk-footer__list-item-link" to="/cookies">
                  Cookies
                </Link>
              </li>
              <li className="nhsuk-footer__list-item nhsuk-footer-default__list-item">
                <Link className="nhsuk-footer__list-item-link" to="/privacypolicy">
                  Privacy policy
                </Link>
              </li>
              <li className="nhsuk-footer__list-item nhsuk-footer-default__list-item">
                <Link className="nhsuk-footer__list-item-link" to="/termsofuse">
                  Terms and conditions
                </Link>
              </li>
              {/* new links */}
              <li className="nhsuk-footer__list-item nhsuk-footer-default__list-item">
                <Link className="nhsuk-footer__list-item-link" to="/help">
                  Help
                </Link>
              </li>
            </ul>
            <div className="nhsuk-footer__meta">
              <p className="nhsuk-footer__copyright">&copy; Group 21</p>
              <div className="nhsuk-footer__meta-item">
                Electronic Prescription System | Contact: 123-456-7890
                <a href="https://forms.gle/uBVJZFyxwULqz2rM9">Survey</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
