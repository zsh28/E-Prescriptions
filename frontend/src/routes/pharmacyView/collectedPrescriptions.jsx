import { useEffect, useState } from "react";
import { getCollectedPrescriptions } from "../../api/prescription";
import { Table, Row } from "../../components/Table";

export const CollectedPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    getCollectedPrescriptions()
      .then((res) => {
          setPrescriptions(res)
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <Table headings={["Patient", "Medication", "Doctor", "Status", "Actions"]}>
      {prescriptions.map((prescription) => (
        <Row key={prescription.id}>
              <div>
                {prescription.patient.user.first_name}{" "}
                {prescription.patient.user.last_name}
              </div>
              <div>{prescription.medication.name}</div>
              <div>
                {prescription.doctor.user.first_name}{" "}
                {prescription.doctor.user.last_name}
              </div>
          <div>
            <strong className={`nhsuk-tag nhsuk-tag--pink`}>
              {prescription.status}
            </strong>
          </div>
          <div className="actions-cell">
            <span role="img" aria-label="Collected">
              ✅
            </span>{" "}
          </div>
        </Row>
      ))}
    </Table>
  );
};
