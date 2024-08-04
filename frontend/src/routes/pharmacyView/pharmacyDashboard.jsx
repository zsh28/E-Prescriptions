import { Card } from "../../components/Card";

export const PharmacyDashboard = () => {
  document.title = 'Pharmacy Dashboard';
    return (
        <>

        <ul className="nhsuk-grid-row">
          <Card href="/account" summary={"Manage your account"}>Account</Card>
          <Card href="/pharmacy/prescriptions" summary={"Manage prescriptions"}>Prescriptions</Card>
        </ul>

        </>
    )
}
