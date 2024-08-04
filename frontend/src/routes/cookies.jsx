import "../App.scss";
import { Checkbox } from "../components/Checkbox";
import { useLocalStorage } from "../hooks/useLocalStorage";



const CookiePolicy = () => {
  document.title = 'Cookie Policy';
  const [functionalCookies, setFunctionalCookies] = useLocalStorage(
    "functional-cookies",
    false,
  );
  const [performanceCookies, setPerformanceCookies] = useLocalStorage(
    "performance-cookies",
    false,
  );
  const [advertisingCookies, setAdvertisingCookies] = useLocalStorage(
    "advertising-cookies",
    false,
  );

  return (
    <>
      <div className="container">
        <div className="cookie-content">
          <h1>Cookie Policy</h1>
          <p>
            This Cookie Policy explains how we use cookies and similar
            technologies to recognize you when you visit our website...
          </p>

          <h2>What are cookies?</h2>
          <p>
            Cookies are small data files that are placed on your computer or
            mobile device when you visit a website. Cookies are widely used by
            website owners to make their websites work, or to work more
            efficiently, as well as to provide reporting information.
          </p>
          <p>
            Cookies set by the website owner (in this case, eNHS) are called
            "first party cookies". Cookies set by parties other than the website
            owner are called "third party cookies". Third party cookies enable
            third party features or functionality to be provided on or through
            the website (e.g. like advertising, interactive content and
            analytics). The parties that set these third party cookies can
            recognize your computer both when it visits the website in question
            and also when it visits certain other websites.
          </p>

          <h2>Why do we use cookies?</h2>
          <p>
            We use first party and third party cookies for several reasons. Some
            cookies are required for technical reasons in order for our Websites
            to operate, and we refer to these as "essential" or "strictly
            necessary" cookies. Other cookies also enable us to track and target
            the interests of our users to enhance the experience on our Online
            Properties. Third parties serve cookies through our Websites for
            advertising, analytics and other purposes. This is described in more
            detail below.
          </p>

          <h2>Types of Cookies We Use</h2>
          <p>We use several types of cookies on our website, including:</p>

          <ul>
            <li>
              <strong>Session Cookies:</strong> These are temporary cookies used
              to remember you during the course of your visit to the website,
              and they expire when you close the web browser.
            </li>
            <li>
              <strong>Persistent Cookies:</strong> These are used to remember
              your preferences within our website and remain on your desktop or
              mobile device even after you close your browser or restart your
              computer.
            </li>
            <li>
              <strong>Strictly Necessary Cookies:</strong> These cookies are
              essential for you to browse the website and use its features, such
              as accessing secure areas of the site.
            </li>
            <li>
              <strong>Performance Cookies:</strong> These cookies collect
              information about how you use our website, such as which pages you
              go to most often and if you get error messages from certain pages.
            </li>
            <li>
              <strong>Functionality Cookies:</strong> These cookies allow our
              website to remember choices you make and provide enhanced, more
              personal features.
            </li>
            <li>
              <strong>Targeting or Advertising Cookies:</strong> These cookies
              are used to deliver advertisements that are more relevant to you
              and your interests, as well as to limit the number of times you
              see an advertisement.
            </li>
          </ul>

          <h2>How We Use Cookies</h2>
          <p>
            We use cookies to improve our website's functionality and to better
            understand how visitors use our website. For example, cookies help
            us with the following:
          </p>

          <ul>
            <li>Verifying your identity for security purposes.</li>
            <li>Remembering your preferences and settings.</li>
            <li>Helping you to fill in forms on our website more easily.</li>
            <li>Providing you with a more personalized experience.</li>
            <li>Measuring and analyzing the performance of our website.</li>
          </ul>

          <p>
            Some cookies may be set by third parties, such as Google Analytics,
            to help us understand how our website is being used so we can make
            improvements. These third parties might also use cookies to collect
            data for ad personalization and measurement.
          </p>

          <h2>GDPR and Your Cookie Choices</h2>
          <p>
            Under the General Data Protection Regulation (GDPR), we are
            committed to providing you with control over your data. This
            includes the use of cookies. Here's how you can manage your cookie
            preferences:
          </p>

          <ul>
            <li>
              <strong>Cookie Consent Tool:</strong> When you visit our website
              for the first time, you will be prompted with a consent banner
              that allows you to choose which types of cookies you want to
              enable during your visit.
            </li>
            <li>
              <strong>Browser Settings:</strong> You can choose how and whether
              cookies will be accepted by your web browser. You can also delete
              all cookies currently stored in your browser.
            </li>
            <li>
              <strong>Third-Party Tools:</strong> Various third-party tools are
              available online that can help you to detect and manage cookies on
              the websites you visit.
            </li>
            <li>
              <strong>Opting Out of Third-Party Networks:</strong> If you wish
              to not have this information used for the purpose of serving you
              targeted ads, you may opt-out by visiting respective third-party
              websites.
            </li>
          </ul>

          <p>
            Please note that if you limit the ability of websites to set
            cookies, you may worsen your overall user experience, since it will
            no longer be personalized to you. It may also stop you from saving
            customized settings, such as login information.
          </p>

          <h2>Your Rights Under GDPR</h2>
          <p>
            GDPR provides certain rights for EU residents, such as the right to
            access, correct, delete, or limit the use of your personal data. If
            you wish to exercise any of these rights, please contact us at the
            email address provided below. We may require you to provide
            verification of your identity before we can respond to such
            requests.
          </p>

          <h2>Changes to This Cookie Policy</h2>
          <p>
            We may update this Cookie Policy to reflect changes to our
            information practices. If we make any material changes, we will
            notify you by email (sent to the e-mail address specified in your
            account) or by means of a notice on this website prior to the change
            becoming effective. We encourage you to periodically review this
            page for the latest information on our privacy practices.
          </p>

          <h2>How can I control cookies?</h2>
          <p>
            You have the right to decide whether to accept or reject cookies.
            You can exercise your cookie rights by setting your preferences in
            the Cookie Consent Manager. The Cookie Consent Manager allows you to
            select which categories of cookies you accept or reject. Essential
            cookies cannot be rejected as they are strictly necessary to provide
            you with services.
          </p>
          <p>
            The Cookie Consent Manager can be found in the notification banner
            and on our website. If you choose to reject cookies, you may still
            use our website though your access to some functionality and areas
            of our website may be restricted. You may also set or amend your web
            browser controls to accept or refuse cookies. As the means by which
            you can refuse cookies through your web browser controls vary from
            browser-to-browser, you should visit your browser's help menu for
            more information.
          </p>

          <form>
            <div className="nhsuk-form-group">
              <fieldset
                className="nhsuk-fieldset"
                aria-describedby="example-hint"
              >
                <legend className="nhsuk-fieldset__legend nhsuk-fieldset__legend--l">
                  <h2 className="nhsuk-fieldset__heading">
                    Manage Your Cookie Preferences
                  </h2>
                </legend>

                <div className="nhsuk-hint">
                  <p>Select all options that you would like to be active.</p>
                  <p>Changes will be saved automatically.</p>
                </div>

                <div className="nhsuk-checkboxes">
                  <Checkbox disabled={true} checked={true}>
                    Essential cookies
                  </Checkbox>

                  <Checkbox
                    checked={functionalCookies}
                    onChange={(e) => setFunctionalCookies(e.target.checked)}
                  >
                    Functional cookies
                  </Checkbox>

                  <Checkbox
                    checked={performanceCookies}
                    onChange={(e) => setPerformanceCookies(e.target.checked)}
                  >
                    Performance cookies
                  </Checkbox>

                  <Checkbox
                    checked={advertisingCookies}
                    onChange={(e) => setAdvertisingCookies(e.target.checked)}
                  >
                    Advertising cookies
                  </Checkbox>
                </div>
              </fieldset>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CookiePolicy;
