import { useCallback, useEffect, useReducer, useState } from "react";
import { getPatients } from "../api/patient";
import { SingleInputForm } from "./Form";

const patientsReducer = (state, action) => {
  switch (action.type) {
    case "loading_finished":
      return { ...state, loading: false };
    case "loading":
      return { ...state, error: null, loading: true };
    case "set_patients":
      return {
        ...state,
        patients: action.patients,
        loading: false,
        error: null,
      };
    case "error":
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

const initialPatientState = {
  loading: true,
  patients: [],
  error: null,
};

export const isPatientMatch = (search, firstName, lastName) => {
  search = search.toLowerCase();
  return (
    firstName.toLowerCase().includes(search) ||
    lastName.toLowerCase().includes(search)
  );
};

export const PatientSearch = ({ setPatients }) => {
  const [patientState, patientDispatch] = useReducer(
    patientsReducer,
    initialPatientState,
  );
  const [allPatients, setAllPatients] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    patientDispatch({ type: "loading" });
    getPatients()
      .then((patients) => {
        setAllPatients(patients);
        patientDispatch({ type: "set_patients", patients: patients });
        setPatients(patients);
      })
      .catch((err) => {
        patientDispatch({ type: "error", error: err.data });
      })
      .finally(() => patientDispatch({ type: "loading_finished " }));
  }, [setPatients]);

  const updateSearch = useCallback(
    (e) => {
      e.preventDefault();
      const filteredPatients = allPatients.filter((p) =>
        isPatientMatch(search.toLowerCase(), p.user.first_name, p.user.last_name),
      );
      patientDispatch({ type: "set_patients", patients: filteredPatients });
      setPatients(filteredPatients);
    },
    [allPatients, search, setPatients],
  );

  return (
    <>
      <SingleInputForm
        onSubmit={updateSearch}
        value={search}
        onInput={(e) => setSearch(e.target.value)}
        error={patientState.error}
        label="Patient's first or last name"
        header={<h2>Search for exsting patients</h2>}
        btnText="Search"
      />
    </>
  );
};
