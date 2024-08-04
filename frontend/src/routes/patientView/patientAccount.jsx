import { DeleteAccount } from "../../components/DeleteAccount";
import { DownloadDataLink } from "../../components/DownloadDataLink";
import { Expander } from "../../components/Exapander";
import { PastLogins } from "../../components/PastLogins";
import { Tab, Tabs } from "../../components/Tabs";
import { ChangePasswordForm } from "./changePassword";
import { PersonalInfoPage } from "./personalInfo";

export function PatientAccount() {
  document.title = "Edit User Info";
  return (
    <div>
      <h1>Personal information</h1>
      <p>
        Some details you can change yourself, these are marked with a 'Change'
        button. In order to change other details you will need to speak with
        your GP or Doctor.
      </p>

      <Tabs>
        <Tab label="Personal Information">
          <PersonalInfoPage />
        </Tab>
        <Tab label="Password">
          <ChangePasswordForm />
        </Tab>
        <Tab label="Manage account">
          <Expander title="Past logins">
            <PastLogins />
          </Expander>
          <Expander title="Download my data">
            <DownloadDataLink />
          </Expander>
          <Expander title="Delete my account">
            <DeleteAccount />
          </Expander>
        </Tab>
      </Tabs>
    </div>
  );
}
