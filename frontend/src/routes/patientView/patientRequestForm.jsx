import { useEffect, useMemo, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listMedication } from "../../api/medication";
import { createPrescriptionRequest } from "../../api/patient";
import { BackLink } from "../../components/BackLink";
import { Breadcrumb, BreadcrumbLink } from "../../components/Breadcrumb";
import { MultistepForm, SingleInputForm } from "../../components/Form";
import { LabelledInput } from "../../components/LabelledInput";

const intiialState = {
  allMedication: [],
  error: null,
  loading: true,
};

const actions = {
  LOADING_FINISHED: 0,
  SET_ALL_MEDICATION: 2,
  SET_ERROR: 3,
  LOADING: 4,
};

const reducer = (state, action) => {
  switch (action.type) {
    case actions.LOADING_FINISHED:
      return { ...state, loading: false };
    case actions.SET_ALL_MEDICATION:
          return {...state, allMedication: action.allMedication};
    case actions.SET_ERROR:
          return { ...state, error: action.error, loading: false };
    case actions.LOADING:
      return { ...state, error: null, loading: true };
    default:
      return { ...state };
  }
};

export const PatientRequestForm = () => {
  document.title = 'Request Prescriptions';
    const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, intiialState);

  const [medication, setMedication] = useState("");
  const [reason, setReason] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const nextPage = () => {
      dispatch({ type: actions.SET_ERROR, error: null })
      setCurrentPage(currentPage + 1);
  }
  const prevPage = () => {
      dispatch({ type: actions.SET_ERROR, error: null })
      setCurrentPage(currentPage - 1);
  }

  useEffect(() => {
    dispatch({ type: actions.LOADING });
    listMedication()
      .then((list) => {
        dispatch({ type: actions.SET_ALL_MEDICATION, allMedication: list });
      })
      .catch((err) => {
          console.error("failed to fetch medication", err)
      })
      .finally(() => {
        dispatch({ type: actions.LOADING_FINISHED });
      });
  }, []);

  const submitMedication = (e) => {
    e.preventDefault();
      if (medication === "") {
          dispatch({type: actions.SET_ERROR, error: "You must select a medication for this request."})
          return;
      }
    nextPage();
  };

  const submitReason = (e) => {
      e.preventDefault();
      if (reason.length === 0) {
          dispatch({type: actions.SET_ERROR, error: "You must provide a reason for this request."})
          return;
      }

      dispatch({ type: actions.LOADING })
      createPrescriptionRequest(medication, reason)
        .then(() => {
            navigate("/patient/requests")
        })
        .catch((err) => {
            // assuming the only error here is that there is already a request with this medication
            dispatch({ type: actions.SET_ERROR, error: "You have already made a request for this medication"});
        })
          .finally(() => {
            dispatch({ type: actions.LOADING_FINISHED })
        })
  };

  return (
    <>
      <Breadcrumb>
        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        <BreadcrumbLink href="/patient/prescriptions">
          Manage prescriptions
        </BreadcrumbLink>
        <BreadcrumbLink href="/patient/requests">
          Prescription requests
        </BreadcrumbLink>
      </Breadcrumb>

      <h1>New prescription request</h1>

      <p>
        In order to request a prescription, you must first provide some details
        about the request.
      </p>

      {currentPage > 0 && <BackLink onClick={prevPage} />}

      <MultistepForm
        page={currentPage}
        error={state.error}
        loading={state.loading}
      >
        <div onSubmit={submitMedication} className="nhsuk-form-group">
          <label className="nhsuk-label" htmlFor="medication">
            Select medication and dosage
          </label>
          <select
            value={medication}
            onInput={(e) => setMedication(e.target.value)}
            className="nhsuk-select"
            id="medication"
            name="medication"
          >
              <option value={""} disabled>
                Select a medication
              </option>
            {state.allMedication.map((medication) => (
              <option value={medication.id} key={medication.id}>
                {medication.name} ({medication.dosage})
              </option>
            ))}
          </select>
        </div>

        <LabelledInput
          id="reason"
          label="Give a short reason for this request"
          onSubmit={submitReason}
          value={reason}
          onInput={(e) => setReason(e.target.value)}
        ></LabelledInput>
      </MultistepForm>
    </>
  );
};
