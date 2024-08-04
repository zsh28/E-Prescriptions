import { Children, useContext, useEffect, useState } from "react";
import { cancelRequest, fetchPrescriptionRequests } from "../../api/patient";
import { ActionLink } from "../../components/ActionLink";
import { Breadcrumb, BreadcrumbLink } from "../../components/Breadcrumb";
import { Button } from "../../components/Button";
import { Row } from "../../components/Table";
import { Table } from "../../components/Table";
import { Tab, Tabs } from "../../components/Tabs";
import { AuthContext } from "../../providers/AuthProvider";

const examplePending = [
  {
    name: "Paracetomol",
    date: "2024-01-01",
  },
  {
    name: "Ibuprofen",
    date: "2024-01-23",
  },
];

const exampleAccepted = [
    {
        name: "Aspirin",
        submissionDate: "2022-02-01",
        acceptedDate: "2022-02-21",
    },
    {
        name: "Codeine",
        submissionDate: "2022-04-01",
        acceptedDate: "2022-04-03",
    },
]

export const PatientRequests = () => {
    document.title = 'Your Requests';
    const { auth } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetchPrescriptionRequests()
            .then(setRequests)
            .catch((err) => {
                alert(err)
            })
    }, []);

    
    const handleCancelRequest = (requestId) => {
        cancelRequest(requestId)
            .then(() => {
                setRequests((requests) => requests.filter((x) => x.id !== requestId))
            })
            .catch((err) => {
                console.error("error cancelling request", err)
            })
    }

    const requestsOfStatus = (status) => requests.filter(x => x.status === status)

  return (
    <>
      <Breadcrumb>
        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        <BreadcrumbLink href="/patient/prescriptions">
          Manage prescriptions
        </BreadcrumbLink>
      </Breadcrumb>

      <h1>Prescription Requests</h1>
      <p>
        Here you can check if your GP has responded to your prescription
        requests. You can also create a new request.
      </p>

      <ActionLink href="new">Create new request</ActionLink>

      <Tabs>
        <Tab label={`Pending (${requestsOfStatus("PENDING").length})`}>
          <Table
            caption={"Pending requests"}
            headings={["Name", "Date submitted", "Reason", "Actions"]}
          >
            {requestsOfStatus("PENDING").map((data, index) => (
              <Row key={index}>
                <p>{data.medication.name} ({data.medication.dosage})</p>
                <p>{new Date(data.date_created).toLocaleString()}</p>
                <p>{data.reason}</p>

                <>
                  <Button onClick={() => handleCancelRequest(data.id)}>Cancel</Button>
                </>
              </Row>
            ))}
          </Table>
        </Tab>
        <Tab label={`Rejected (${requestsOfStatus("REJECTED").length})`}>
          <Table
            caption={"Rejected requests"}
            headings={["Name", "Date submitted", "Date rejected", "Actions"]}
          >
            {requestsOfStatus("REJECTED").map((data, index) => (
              <Row key={index}>
                <p>{data.medication.name} ({data.medication.dosage})</p>
                <p>{data.datae_created}</p>
                <p>{data.date_updated}</p>

                <>
                  <Button>Renew</Button>
                </>
              </Row>
            ))}
          </Table>
        </Tab>
      </Tabs>
    </>
  );
};
