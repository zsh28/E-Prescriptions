import { useState } from "react";
import { ActionLink } from "../../components/ActionLink";
import { Row, Table } from "../../components/Table";
import { Warning } from "../../components/Warning";
import { Link } from "react-router-dom";
import { PatientSearch } from "../../components/PatientSearch";

export const DoctorPatients = () => {
  document.title = 'Manage Patients';
  const [patients, setPatients] = useState([]);

  return (
    <>
      <h1>Manage Patients</h1>

      <p>This page lets you manage existing patients. Start by searching for a patient using their first or last name.</p>

      <PatientSearch setPatients={setPatients} />

      <Warning title="Privacy notice">
        Some actions will raise a privacy alert.
      </Warning>

      <Table
        captions="Resulst"
        label="label??"
        headings={["First Name", "Last Name", "Actions"]}
      >
        {patients.map((patient) => (
          <Row>
            <p>{patient.user.first_name}</p>
            <p>{patient.user.last_name}</p>
            <Link
              to={`/doctor/patient/${patient.user.id}`}
              state={{
                patient: patient,
              }}
            >
              View
            </Link>
          </Row>
        ))}
      </Table>
    </>
  );
};
