import { Table, Row } from "../../components/Table";
import { useEffect, useState, useReducer } from "react";
import { getGPDoctors } from "../../api/doctor";
import { BigError } from "../../components/BigError";
import { SingleInputForm } from "../../components/Form";
import { LabelledInput } from "../../components/LabelledInput";

const doctorReducer = (state, action) => {
  switch (action.type) {
    case "loading_finished":
      return { ...state, loading: false };
    case "loading":
      return { ...state, error: null, loading: true };
    case "set_doctors":
      return {
        ...state,
        doctors: action.doctors,
        loading: false,
        error: null,
      };
    case "error":
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

const initialDoctorState = {
  loading: true,
  doctors: [],
  error: null,
};

export const isDoctorMatch = (search, firstName, lastName) => {
  const words = search.toLowerCase().split(" ");
  const wholename = firstName.toLowerCase() + lastName.toLowerCase();
  return words.some((w) => wholename.includes(w))
};

export const GpDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [doctorState, doctorDispatch] = useReducer(
    doctorReducer,
    initialDoctorState,
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    doctorDispatch({ type: "loading" });
    getGPDoctors()
      .then((doctors) => {
        setDoctors(doctors);
        doctorDispatch({ type: "set_doctors", doctors: doctors });
      })
      .catch((err) => {
        doctorDispatch({ type: "error", error: err.data });
      })
      .finally(() => doctorDispatch({ type: "loading_finished " }));
  }, [setDoctors]);

  if (doctorState.loading) {
    return <p>Loading...</p>;
  }

  if (doctorState.error) {
    return <BigError>{doctorState.error}</BigError>;
  }

  return (
    <>
      <h2>Search for doctors in this GP</h2>
      <LabelledInput
        value={search}
        onInput={(e) => setSearch(e.target.value)}
        label="Doctor's name"
      />
      <Table
        captions="Resulst"
        label="label??"
        headings={["Title", "First Name", "Last Name"]}
      >
        {doctors
          .filter((x) =>
            isDoctorMatch(search, x.user.first_name, x.user.last_name),
          )
          .map((dr) => (
            <Row>
              <p>{dr.title}</p>
              <p>{dr.user.first_name}</p>
              <p>{dr.user.last_name}</p>
            </Row>
          ))}
      </Table>
    </>
  );
};
