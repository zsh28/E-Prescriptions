import { useContext } from "react"
import { AuthContext } from "../providers/AuthProvider"
import { DoctorAccount } from "../routes/doctorView/doctorAccount"
import { GpAccount } from "../routes/gpView/gpAccount"
import {PatientAccount} from "../routes/patientView/patientAccount"


export const ManageAccount = () => {
    const {auth} = useContext(AuthContext);

    const groupViews = {
        "patient_group": <PatientAccount />,
        "gp_group": <GpAccount />,
        "doctor_group": <DoctorAccount />,
        "pharmacy_group": <DoctorAccount />,
    }

      for (let group of auth.groups) {
        if (group in groupViews) {
          return groupViews[group];
        }
      }


  return <h1>A page for your user type cannot be found.</h1>;
}
