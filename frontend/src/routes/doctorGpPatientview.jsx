import { getPatientInfo } from "../api/user";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { PatientProfile } from "../components/PatientProfile";
import { BigError } from "../components/BigError";

export const DoctorGPPatientView = () => {
  const { patientId } = useParams();
  const location = useLocation();
  const [patient, setPatient] = useState(location.state?.patient);
  const [error, setError] = useState(null);

  const setPatientTitle = (patient) =>
    (document.title = `Details for ${patient.user.first_name} ${patient.user.last_name}`);

  useEffect(() => {
    if (patient == null) {
      // fetch the patient's details using the ID in the params
      getPatientInfo(patientId)
        .then((patient) => {
          setPatientTitle(patient);
          setPatient(patient);
        })
        .catch((err) => {
          if (err.status === 404) {
            setError("Could not find that patient");
            return;
          }
          alert("Something went wrong fetching the patient's data");
          console.error(err);
        });
    } else {
      setPatientTitle(patient);
    }
  });

  if (error) {
    return <BigError>{error}</BigError>;
  }

  return (
    <>
      <PatientProfile patient={patient} />
    </>
  );
};
