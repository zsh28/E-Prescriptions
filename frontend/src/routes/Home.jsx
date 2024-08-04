import { useContext } from "react";
import { Link, useOutlet } from "react-router-dom";
import "../App.scss";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { UserStatus } from "../components/UserStatus";
import { AuthContext } from "../providers/AuthProvider";

const HomeContent = () => {
  document.title = 'E-Prescriptions Home';
  return (
    <>
      <h1 className="nhsuk-heading-xl">
        E-Prescription Service: sign in or set up an account
      </h1>

      <p className="nhsuk-body">
        This service will let you manage your medical infromation,
        prescriptions, and other medicines. It also provides an easy way to
        request new medicine.
      </p>

      <p className="nhsuk-body">
        In order to use this service you must either sign in or make a new
        account by registering.
      </p>

      <div className="button-group">
        <Link
          to={`/login`}
          role="button"
          draggable="false"
          className="nhsuk-button nhsuk-button--start"
          data-module="nhsuk-button"
        >
          Sign in
        </Link>

        <Link
          to={"/register"}
          className="nhsuk-button nhsuk-button--secondary"
          data-module="nhsuk-button"
          type="submit"
        >
          Register
        </Link>
      </div>
    </>
  );
};

export const Home = () => {
  const outlet = useOutlet();

  const { isAuthenticated } = useContext(AuthContext);

  return (
    <>
      <a
        href="#main-content"
        className="nhsuk-skip-link"
        data-module="nhsuk-skip-link"
      >
        Skip to main content
      </a>

      <header className="nhsuk-header" role="banner" data-module="nhsuk-header">
        <div className="nhsuk-header__container nhsuk-width-container">
          <div className="nhsuk-header__logo">
            <a
              href="/"
              className="nhsuk-header__link nhsuk-header__link--service "
            >
              <div className="nhsuk-header__service-name">
                E-Prescription Service
              </div>
            </a>
          </div>


          {
              isAuthenticated && <UserStatus />
          }
        </div>

        <Navbar />
      </header>

      <div className="nhsuk-width-container app-width-container">
        <main
          className="nhsuk-main-wrapper app-main-class"
          id="main-content"
          role="main"
        >
          {/* Show the children if on a nested route or the home page content  */}
          {outlet || <HomeContent />}
        </main>
      </div>

      <Footer />
    </>
  );
};
