import { useContext, useReducer, useState } from "react";
import { findPatient, invitePatient } from "../../api/patient";
import { Breadcrumb, BreadcrumbLink } from "../../components/Breadcrumb";
import { SingleInputForm } from "../../components/Form";
import { AuthContext } from "../../providers/AuthProvider";

function reducer(state, action) {
  switch (action.type) {
    case "error":
      return { ...state, error: action.error, success: false, loading: false };
    case "success":
      return { ...state, error: null, success: true, loading: false };
    case "loading":
      return { ...state, loading: true, error: null, success: false };
    default:
      return state;
  }
}

const initialState = {
  loading: false,
  success: false,
  error: null,
};

export const GpInvite = () => {
  document.title = 'Invite a Patient';
  const [state, dispatch] = useReducer(reducer, initialState);
  const [email, setEmail] = useState("");
  const { auth } = useContext(AuthContext);

  const handleSubmit = (e) => {
    dispatch({ type: "loading" });

    e.preventDefault();
    const form = e.target.form;
    if (!form.checkValidity()) {
      form.reportValidity();
      // to remove loading, the browser will show errors
      dispatch({ type: "error", error: null });
      return;
    }

    findPatient(email)
      .then((res) => {
        const patientId = res.patient_id;
        if (patientId == null) {
          console.error("invalid response:", res);
          dispatch({
            type: "error",
            error: "Could not get that patient's ID.",
          });
          return;
        }
        invitePatient(patientId, auth.gpId)
          .then((res) => {
            dispatch({ type: "success" });
          })
          .catch((err) => {
            if (err.data.patient == null) {
              dispatch({
                type: "error",
                error: "Something went horribly wrong.",
              });
              return;
            }

            dispatch({ type: "error", error: err.data.patient.join("\n") });
          });
      })
      .catch((err) => {
        dispatch({ type: "error", error: err.data.email.join("\n") });
      });
  };

  return (
    <>
      <Breadcrumb>
        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        <BreadcrumbLink href="/gp/patients">Manage patients</BreadcrumbLink>
      </Breadcrumb>

      <h1>Invite a new patient</h1>

      <p>
        Invite a new patient to the GP. They will recieve an invitation which
        they can accept by logging in.
      </p>
      <p>
        They will need to register an account themselves before you can do this.
      </p>

      {state.success && (
        <div className="nhsuk-inset-text">
          <span className="nhsuk-u-visually-hidden">Information: </span>
          <p>Invite sent successfully.</p>
        </div>
      )}

      <SingleInputForm
        onSubmit={handleSubmit}
        header={null}
        type="email"
        label="Patient's email address"
        error={state.error}
        value={email}
        onInput={(e) => setEmail(e.target.value)}
      ></SingleInputForm>
    </>
  );
};
