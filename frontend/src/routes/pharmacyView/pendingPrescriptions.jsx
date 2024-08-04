import { useContext, useEffect, useState } from "react";
import {
  getPrescriptions,
  setPrescriptionStatus,
} from "../../api/prescription";
import { Table, Row } from "../../components/Table";
import { Button } from "../../components/Button";
import { AuthContext } from "../../providers/AuthProvider";
import { LabelledInput } from "../../components/LabelledInput";
import { LabelledSelect } from "../../components/LabelledSelect";
import { BigError } from "../../components/BigError";

export const PendingPrescriptions = () => {
  const { auth } = useContext(AuthContext);
  const [collectedIds, setCollectedIds] = useState(new Set()); // tracking collected prescriptions
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTermPatient, setSearchTermPatient] = useState("");
  const [searchTermMedication, setSearchTermMedication] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [bigError, setBigError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getPrescriptions()
      .then((data) => {
        setPrescriptions(data);
        setLoading(false);
      })
      .catch((error) => {
        setBigError("Failed to retrieve prescriptions");
        console.error("Failed to fetch prescriptions", error);
        setLoading(false);
      });
  }, []);

  const handleUpdateStatus = (p, status) => {
    setPrescriptionStatus(p.id, status)
      .then((res) => {
        setPrescriptions((prescriptions) => {
          let filtered = prescriptions.filter((x) => x.id !== p.id);
          filtered.push({ ...p, status });
                return filtered;
        });
      })
      .catch((error) => {
        setBigError("Failed to update prescription.");
        console.error(
          `Failed to update status for prescription ${p.id}`,
          error,
        );
      });
  };

  const tagColours = {
    ready: "green",
    pending: "blue",
    collected: "pink",
  };

  return (
    <>
      {bigError && <BigError>{bigError}</BigError>}

      <LabelledInput
        value={searchTermPatient}
        onInput={(e) => setSearchTermPatient(e.target.value)}
        label="Search by Patient Name"
      />

      <LabelledInput
        value={searchTermMedication}
        onInput={(e) => setSearchTermMedication(e.target.value)}
        label="Search by Medication"
      />

      <LabelledSelect
        label="Filter by Status"
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
      >
        <option value="">All</option>
        <option value="Pending">Pending</option>
        <option value="Ready">Ready</option>
      </LabelledSelect>

      <Table
        headings={["Patient", "Medication", "Doctor", "Status", "Actions"]}
      >
        {prescriptions
          .filter((x) => x.status !== "COLLECTED")
          .map((prescription) => (
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
                <strong
                  className={`nhsuk-tag nhsuk-tag--${tagColours[prescription.status.toLowerCase()]}`}
                >
                  {prescription.status}
                </strong>
              </div>
              <div className="actions-cell">
                {prescription.status === "PENDING" && (
                  <Button
                    onClick={() => handleUpdateStatus(prescription, "READY")}
                  >
                    Mark as Ready
                  </Button>
                )}
                {prescription.status === "READY" && (
                  <Button
                    onClick={() =>
                      handleUpdateStatus(prescription, "COLLECTED")
                    }
                  >
                    Mark as Collected
                  </Button>
                )}
              </div>
            </Row>
          ))}
      </Table>
    </>
  );
};
