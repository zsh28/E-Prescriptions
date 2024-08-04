import React, { useState, useEffect, useContext, useMemo } from "react";
import { getPrescriptions } from "../../api/prescription";
import { BigError } from "../../components/BigError";
import { Breadcrumb, BreadcrumbLink } from "../../components/Breadcrumb";
import { Button } from "../../components/Button";
import { LabelledInput } from "../../components/LabelledInput";
import { LabelledSelect } from "../../components/LabelledSelect";
import { Table, Row } from "../../components/Table";
// import { fetchPrescriptions, updatePrescriptionStatus } from '../../api/prescriptions';
import { AuthContext } from "../../providers/AuthProvider";
import "../../styles/PrescriptionTable.css";

export const ActivePrescriptions = () => {
  document.title = "Prescription Table";
  const { auth } = useContext(AuthContext);
  const [prescriptions, setPrescriptions] = useState([]);
  const [filter, setFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [bigError, setBigError] = useState(null);

  // Until API is set
  useEffect(() => {
    getPrescriptions()
      .then((res) => {
        setPrescriptions(res);
      })
      .catch((err) => {
        setBigError("Something went wrong fetching your prescriptions.");
        console.error(err);
      });
  }, []);

  const handleAction = (action, prescriptionId) => {
    switch (action) {
      case "view":
        // Not yet
        console.log("View details not implemented yet.");
        break;
      case "renew":
        // Not yet
        console.log("Renew function not implemented yet.");
        break;
      case "cancel":
        setPrescriptions((currentPrescriptions) =>
          currentPrescriptions.filter(
            (prescription) => prescription.id !== prescriptionId,
          ),
        );
        break;
      default:
        console.error(`Unknown action: ${action}`);
    }
  };

  const filteredPrescriptions = useMemo(
    () =>
      prescriptions.filter(
        (prescription) =>
          prescription.medication.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (filter === "" || prescription.status === filter),
      ),
    [prescriptions, filter, searchTerm],
  );

  const tagColours = {
    "Due for renewal": "orange",
    Active: "green",
  };

  return (
    <>
      <Breadcrumb>
        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        <BreadcrumbLink href="/patient/prescriptions">
          Manage prescriptions
        </BreadcrumbLink>
      </Breadcrumb>

      <h1>My Prescriptions</h1>
      <p>Here you can view and manage your prescriptions.</p>

      {bigError && <BigError>{bigError}</BigError>}

      <LabelledInput
        value={searchTerm}
        onInput={(e) => setSearchTerm(e.target.value)}
        label="Medication name"
      />

      <LabelledSelect
        label="Filter by status"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="">All</option>
        <option value="Active">Active</option>
        <option value="Due for renewal">Due for Renewal</option>
      </LabelledSelect>

      <Table headings={["Date", "Medication", "Status", "Actions"]}>
        {filteredPrescriptions.map((prescription) => (
          <Row key={prescription.id}>
            <div>{prescription.date}</div>
            <div>
              {prescription.medication.name} ({prescription.medication.dosage})
            </div>

            <div>
              <strong
                className={`nhsuk-tag nhsuk-tag--${tagColours[prescription.status]}`}
              >
                {prescription.status}
              </strong>
            </div>
            <div className="actions-cell">
              <Button onClick={() => handleAction("view", prescription.id)}>
                View
              </Button>
              <Button onClick={() => handleAction("renew", prescription.id)}>
                Renew
              </Button>
              <Button onClick={() => handleAction("cancel", prescription.id)}>
                Cancel
              </Button>
            </div>
          </Row>
        ))}
      </Table>
    </>
  );
};

export default ActivePrescriptions;
