
export const PrivacyPage = () => {
  document.title = 'Privacy Policy';
  return (
    <div className="nhsuk-width-container">
      <main className="nhsuk-main-wrapper" id="maincontent" role="main">
        <div className="nhsuk-grid-row">
          <div className="nhsuk-grid-column-two-thirds">
            <h1>Privacy policy</h1>
            <p>By using this application, you are agreeing to the following privacy policy:</p>


              <h2>Encryption and Data Security</h2>
              <p>Encryption is essential in our data protection strategy. Data is encrypted on servers before database storage. While temporarily stored in plaintext, the risks are carefully mitigated.</p>


            <h2>Handling Sensitive Information</h2>
            <p>Stored sensitive data is decrypted only when necessary. With TLS, sensitive information remains secure during transit, adhering to web security standards.</p>


            <h2>Flexible Data Protection</h2>
            <p>Currently, we encrypt user addresses and remain adaptable for future requirements. Our architecture is designed for scalability and enhanced security.</p>


            <h2>Hashing Algorithms</h2>
            <p>We use hashing, specifically SHA-256, for secure, non-retrievable information storage. This is ideal for passwords and other data that do not need to be accessed once stored.</p>


            <h2>Authentication</h2>
            <p>Users must authenticate using email and password. We support two-factor authentication for additional security, in line with industry practices.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export const TermsPage = () => {
  document.title = 'Terms and Conditions';
  return (
    <div className="nhsuk-width-container">
      <main className="nhsuk-main-wrapper" id="maincontent" role="main">
        <div className="nhsuk-grid-row">
          <div className="nhsuk-grid-column-two-thirds">
            <h1>Terms of use</h1>
            <p>There are some terms of use for this application.</p>


            <h2>Protecting Patient Data</h2>
            <p>We are committed to safeguarding the privacy and security of our patients' personal information. Measures such as encryption and restricted access are in place to protect data integrity and confidentiality.</p>

            <h2>Consent</h2>
            <p>Patient consent is paramount for processing personal medical data. We ensure transparency in how data is used and provide mechanisms for patients to grant consent.</p>

            <h2>Data Quality and Accuracy</h2>
            <p>Our system validates and maintains high-quality, up-to-date prescription data to accurately reflect patients' medical needs.</p>

            <h2>Data Portability</h2>
            <p>Patients have the right to access and export their prescription data in a secure, structured format.</p>

            <h2>Data Retention and Deletion</h2>
            <p>Our data retention policies comply with GDPR, ensuring secure deletion of data when it is no longer needed or upon patient request.</p>

            <h2>Legal Responsibilities and Documentation</h2>
            <p>We maintain detailed records of data processing activities to uphold GDPR compliance and enhance patient privacy.</p>
          </div>
        </div>
      </main>
    </div>
  );
};
