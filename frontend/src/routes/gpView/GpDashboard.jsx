import { Card } from "../../components/Card";

export const GpDashboard = () => {
  document.title = 'GP Dashboard';
    return (
        <>

        <ul className="nhsuk-grid-row">
          <Card href="/account" summary={"Manage your account"}>Account</Card>
          <Card href="/gp/patients" summary={"Add or remove patients from the GP"}>Manage patients</Card>
          <Card href="/gp/doctors" summary={"Manage Doctors in the GP"}>Doctors</Card>
        </ul>

        </>
    )
}
