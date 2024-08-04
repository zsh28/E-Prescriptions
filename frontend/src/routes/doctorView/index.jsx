import { Card } from "../../components/Card";

export const DoctorDashboard = () => {
  document.title = 'Doctor Dashboard';
  return (
    <ul className="nhsuk-grid-row">
      <Card href="/account" summary={"Manage your account"}>Manage account</Card>
      <Card href="/doctor/patients" summary={"Add new patients or update their records."}>Manage patients</Card>
      <Card href="/doctor/prescriptions" summary={"View and manage prescription requests."}>Prescription requests</Card>
    </ul>
  );
};
