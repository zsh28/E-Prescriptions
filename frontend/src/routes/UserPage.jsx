import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { DoctorDashboard } from "./doctorView";
import { GpDashboard } from "./gpView/GpDashboard";
import { PatientDashboard } from "./patientView";
import { PharmacyDashboard } from "./pharmacyView/pharmacyDashboard";

export const UserPage = () => {
  document.title = 'Your Page';
  const { auth } = useContext(AuthContext);

  const groupViews = {
    patient_group: <PatientDashboard />,
    doctor_group: <DoctorDashboard />,
    gp_group: <GpDashboard />,
    pharmacy_group: <PharmacyDashboard />,
  };

  for (let group of auth.groups) {
    if (group in groupViews) {
      return groupViews[group];
    }
  }

  return <h1>A page for your user type cannot be found.</h1>;
};
