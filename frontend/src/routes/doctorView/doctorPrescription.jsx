import { useEffect, useReducer, useState } from "react";
import { Tab, Tabs } from "../../components/Tabs";
import { fetchPrescriptionRequests } from "../../api/patient";
import { BigError } from "../../components/BigError";
import { Button } from "../../components/Button";
import { Row, Table } from "../../components/Table";
import { setRequestStatus } from "../../api/prescription";
import { LabelledInput } from '../../components/LabelledInput';
import { LabelledSelect } from '../../components/LabelledSelect';

const reducer = (state, action) => {
  switch (action.type) {
    case "loading":
      return { ...state, loading: true, error: null };
    case "loading_finished":
      return { ...state, loading: false };
    case "error":
      return { ...state, error: action.error };
    default:
      return state;
  }
};

const initialState = {
  error: null,
  loading: true,
};

export const DoctorPrescriptions = () => {
  document.title = "Prescription Requests";

  const [state, dispatch] = useReducer(reducer, initialState);
  const [requests, setRequests] = useState([]);
  const [bigError, setBigError] = useState(null);
  const [searchTermPatient, setSearchTermPatient] = useState('');
  const [searchTermMedication, setSearchTermMedication] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    dispatch({ type: "loading" });
    fetchPrescriptionRequests()
      .then((res) => {
        setRequests(res);
      })
      .catch((err) => {
        console.error(err);
        dispatch({ type: "error", error: err.data });
      })
      .finally(() => {
        dispatch({ type: "loading_finished" });
      });
  }, []);

  const tagColours = {
    ACCEPTED: "green",
    REJECTED: "red",
  };

  const changeReqStatus = async (req, status) => {
    dispatch({ type: "loading" });
    setRequestStatus(req.id, status)
      .then((res) => {
        setRequests((requests) => {
          console.log(requests);
          let filtered = requests.filter((x) => x.id !== req.id);
          filtered.push({ ...req, status });
          return filtered;
        });
      })
      .catch((err) => {
        dispatch({ type: "error", error: err.data });
      })
      .finally(() => {
        dispatch({ type: "loading_finished" });
      });
  };

  return (
    <>
      <h1>Prescription Requests</h1>

      {bigError && <BigError>{bigError}</BigError>}
      {state.error && <BigError>{JSON.stringify(state.error)}</BigError>}
      <LabelledInput
        value={searchTermPatient}
        onInput={e => setSearchTermPatient(e.target.value)}
        label="Search by Patient Name"
      />
      <LabelledInput
        value={searchTermMedication}
        onInput={e => setSearchTermMedication(e.target.value)}
        label="Search by Medication Name"
      />

      <LabelledSelect
        label="Filter by Status"
        value={filterStatus}
        onChange={e => setFilterStatus(e.target.value)}
      >
        <option value="">All</option>
        <option value="PENDING">Pending</option>
        <option value="ACCEPTED">Accepted</option>
        <option value="REJECTED">Rejected</option>
      </LabelledSelect>

      <Tabs>
        <Tab label={`Awaiting review`}>
          <Table
            headings={["Date", "Patient / Reason", "Medication", "Actions"]}
          >
            {requests
              .filter((x) => x.status === "PENDING" &&
                             (x.patient.user.first_name.toLowerCase().includes(searchTermPatient.toLowerCase()) ||
                              x.medication.name.toLowerCase().includes(searchTermMedication.toLowerCase())) &&
                             (filterStatus === "" || x.status === filterStatus))
              .map((req) => (
                <Row>
                  <div>{new Date(req.date_created).toLocaleDateString()}</div>
                  <div>
                    <p>
                      {req.patient.user.first_name} {req.patient.user.last_name}
                    </p>
                    <p>{req.reason}</p>
                  </div>
                  <div>
                    {req.medication.name} ({req.medication.dosage})
                  </div>
                  <div>
                    <Button onClick={() => changeReqStatus(req, "ACCEPTED")}>
                      Approve
                    </Button>

                    <Button onClick={() => changeReqStatus(req, "REJECTED")}>Reject</Button>
                  </div>
                </Row>
              ))}
          </Table>
        </Tab>

        <Tab label={`Other`}>
          <Table
            headings={[
              "Date updated",
              "Patient / Reason",
              "Medication",
              "Status",
            ]}
          >
            {requests
              .filter((x) => x.status !== "PENDING" &&
                             (x.patient.user.first_name.toLowerCase().includes(searchTermPatient.toLowerCase()) ||
                              x.medication.name.toLowerCase().includes(searchTermMedication.toLowerCase())) &&
                             (filterStatus === "" || x.status === filterStatus))
              .map((req) => (
                <Row>
                  <div>{new Date(req.date_updated).toLocaleDateString()}</div>
                  <div>
                    <p>
                      {req.patient.user.first_name} {req.patient.user.last_name}
                    </p>
                    <p>{req.reason}</p>
                  </div>
                  <div>
                    {req.medication.name} ({req.medication.dosage})
                  </div>
                  <div>
                    <strong
                      className={`nhsuk-tag nhsuk-tag--${tagColours[req.status]}`}
                    >
                      {req.status}
                    </strong>
                  </div>
                </Row>
              ))}
          </Table>
        </Tab>
      </Tabs>
    </>
  );
};
