import { useContext, useEffect, useReducer, useState } from "react";
import { getPatientInfo } from "../../api/user";
import { Card } from "../../components/Card";
import { AuthContext } from "../../providers/AuthProvider";
import { BigError } from "../../components/BigError";
import { Warning } from "../../components/Warning";

function pharmacyReducer(state, action) {
  switch (action.type) {
    case "set_pharmacy":
      return { ...state, loading: false, pharmacyId: action.pharmacyId };
    case "loading":
      return { ...state, loading: true, pharmacyId: null };
    case "loading_finished":
      return { ...state, loading: false };
    default:
      return state;
  }
}

const initialPharmacyState = {
  pharmacyId: null,
  loading: true,
};

export const PatientPrescriptions = () => {
  document.title = "Your Prescriptions";
  const { auth } = useContext(AuthContext);
  const [state, dispatch] = useReducer(pharmacyReducer, initialPharmacyState);
  const [bigError, setBigError] = useState(null);

  useEffect(() => {
    dispatch({ type: "loading" });
    getPatientInfo(auth.patientId)
      .then((res) => {
        dispatch({ type: "set_pharmacy", pharmacyId: res.pharmacy?.id });
      })
      .catch((err) => {
        setBigError("Something went wrong fetching your information.");
        console.error(err);
      })
      .finally(() => dispatch({ type: "loading_finished" }));
  }, []);

  return (
    <>
      <h1>Manage your prescriptions</h1>

      {state.loading
        ? "Loading..."
        : !state.pharmacyId && (
            <Warning title="No pharmacy">
              You will need to choose a pharmacy before making prescription
              requests.
            </Warning>
          )}

      {bigError && <BigError>{bigError}</BigError>}

      <ul className="nhsuk-grid-row">
          {
                  state.pharmacyId && 
          <Card
          summary="Create new prescription requests or check if your GP has responded."
          href="/patient/requests"
        >
          Status of requests
        </Card>
          }

          {
                  state.pharmacyId && 
        <Card
          href="active"
          summary="View prescriptions which have been approved and can be collected"
        >
          Active prescriptions
        </Card>
          }
        <Card
          href="/patient/pharmacy"
          summary="Change the nominated pharmacy that handles your prescriptions"
        >
          Change pharmacy
        </Card>
      </ul>
    </>
  );
};
