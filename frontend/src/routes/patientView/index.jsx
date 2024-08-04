import { Card } from "../../components/Card";

export const PatientDashboard = () => {
  document.title = "User Dashboard";
  return (
    <ul className="nhsuk-grid-row">
      <Card
        summary="Change your password, manage 2-step verification and handle your data."
        href="/account"
      >
        Personal and account information
      </Card>
      <Card
        summary="Everything to do with prescriptions. Change your pharmacy, make prescription requests, and checkup on existing prescriptions."
        href="/patient/prescriptions"
      >
        Manage prescriptions
      </Card>
      <Card
        summary="Messages from your GP or doctor. If you are not part of a GP, this is where you can accept their invite."
        href="/patient/messages"
      >
        Messages
      </Card>
    </ul>
  );
};
