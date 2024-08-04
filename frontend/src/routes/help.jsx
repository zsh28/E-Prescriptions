import "../App.scss";
import { Expander } from "../components/Exapander";

const Help = () => {
  document.title = "Help and FAQ's";
  return (
    <>
      <Expander title="How to Request Prescriptions">
        <p>You can request a new prescription once you have accepted an invite to a GP and have a pharmacy set.</p>
        <p>Visit your dashboard, manage prescriptions, status of requests.</p>
      </Expander>

      <Expander title="How to View/Edit Account Details">
        <p>In the manage account section of the dashboard, you can change your password, setup 2-step verification, and see previous logins to your account.</p>
      <p>This is also where you can download a copy of your data.</p>
      </Expander>
    </>
  );
};

export default Help;
