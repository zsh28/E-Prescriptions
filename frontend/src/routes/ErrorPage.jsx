import { useRouteError } from "react-router-dom";
import { BackLink } from "../components/BackLink";



export const ErrorPage = () => {
  document.title = 'Error - not found';
  const error = useRouteError();
  console.error(error);

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
        </div>
      </header>

      <div className="nhsuk-width-container app-width-container">
        <main
          className="nhsuk-main-wrapper app-main-class"
          id="main-content"
          role="main"
        >
          <h1 className="nhsuk-heading-xl">
            {error.statusText || error.message}
          </h1>

          <p className="nhsuk-body">
            There was a problem accessing that page. Please check that the URL
            is correct and try again. Alternatively, you can try to go back to
            the previous page.
          </p>

          <BackLink />
        </main>
      </div>
    </>
  );
};
