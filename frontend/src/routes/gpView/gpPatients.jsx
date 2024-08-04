import { useEffect, useRef, useState } from "react";
import { ActionLink } from "../../components/ActionLink";
import { Row, Table } from "../../components/Table";
import { Warning } from "../../components/Warning";
import { Link } from "react-router-dom";
import { isPatientMatch, PatientSearch } from "../../components/PatientSearch";
import { Tab, Tabs } from "../../components/Tabs";
import { getInvites } from "../../api/patient";
import { LabelledInput } from "../../components/LabelledInput";
import { LabelledSelect } from "../../components/LabelledSelect";
import { ContinueBtn } from "../../components/ContinueBtn";

export const GpPatients = () => {
  document.title = "GP Patients";
  const [patients, setPatients] = useState([]);

  const [invites, setInvites] = useState(null);

  const [inviteSearch, setInviteSearch] = useState("");
  const [inviteStatus, setInviteStatus] = useState("");

  useEffect(() => {
    getInvites()
      .then((res) => {
        setInvites(res);
      })
      .catch((err) => {
        console.error("err", err);
      });
  }, []);

  const updateInviteSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const search = formData.get("search");
    const status = formData.get("status");
    setInviteSearch(search);
    setInviteStatus(status);
  };

  const tagColours = {
    PENDING: "pink",
    ACCEPTED: "green",
    REJECTED: "red",
  };

  return (
    <>
      <h1>Manage Patients</h1>

      <p>
        This page lets you manage existing patients or invite a new patient
        using the button below:
      </p>

      <ActionLink href="/gp/invite">Invite a new patient</ActionLink>

      <hr />

      <Tabs>
        <Tab label="Existing patients">
          <PatientSearch setPatients={setPatients} />

          <Warning title="Privacy notice">
            Some actions will raise a priavcy alert.
          </Warning>

          <Table
            captions="Resulst"
            label="label??"
            headings={["First Name", "Last Name", "Actions"]}
          >
            {patients.map((patient) => (
              <Row key={patient.id}>
                <p>{patient.user.first_name}</p>
                <p>{patient.user.last_name}</p>
                <Link
                  to={`/patient/${patient.id}`}
                  state={{
                    patient: patient,
                  }}
                >
                  View
                </Link>
              </Row>
            ))}
          </Table>
        </Tab>

        <Tab label="Invites">
          <form className="nhsuk-form-group" onSubmit={updateInviteSearch}>
            <LabelledInput label="Patient name" name="search" />

            <LabelledSelect name="status" label="Status">
              <option value="">Any</option>
              <option value="PENDING">Pending</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
            </LabelledSelect>

            <div>
              <ContinueBtn>Search</ContinueBtn>
            </div>
          </form>

          {invites == null ? (
            "Loading..."
          ) : (
            <Table headings={["First name", "Last name", "Date", "Status"]}>
              {invites
                .filter(
                  (invite) =>
                    (inviteStatus === "" || invite.status === inviteStatus) &&
                    isPatientMatch(
                      inviteSearch,
                      invite.patient.first_name,
                      invite.patient.last_name,
                    ),
                )
                .map((invite) => (
                  <Row>
                    <div>{invite.patient.first_name}</div>
                    <div>{invite.patient.last_name}</div>
                    <div>
                      {new Date(invite.date_created).toLocaleDateString()}
                    </div>
                    <div>
                      <strong
                        className={`nhsuk-tag nhsuk-tag--${tagColours[invite.status]}`}
                      >
                        {invite.status}
                      </strong>
                    </div>
                  </Row>
                ))}
            </Table>
          )}
        </Tab>
      </Tabs>
    </>
  );
};
