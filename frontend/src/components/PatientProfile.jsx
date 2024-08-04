import { Button } from "./Button";
import { SummaryList, SummaryListHTML, SummaryListItem } from "./SummaryList";
import { useState } from "react";
import { PersonalInfoPage } from "../routes/patientView/personalInfo";
import { Warning } from "./Warning";
import { BackLink } from "./BackLink";

export const PatientProfile = ({ patient }) => {
  return (
    <>
      <BackLink />
      <h1>Patient details</h1>

      <Warning title="Privacy warning">
        You are viewing the personal details of a patient. The patient has been
        made aware of your access to this data. Changes to any data will raise
        an additional notification.
      </Warning>

      <PersonalInfoPage patientId={patient.id} />
    </>
  );
};
