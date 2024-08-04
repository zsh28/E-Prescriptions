import { useContext, useEffect, useReducer, useState } from "react";
import { changePharmacy, listPharmacies } from "../../api/pharmacy";
import { Button } from "../../components/Button";
import { Breadcrumb, BreadcrumbLink } from "../../components/Breadcrumb";
import { BigError } from "../../components/BigError";
import { LabelledInput } from "../../components/LabelledInput";
import { Table, Row } from "../../components/Table";
import { AuthContext } from "../../providers/AuthProvider";
import { getPatientInfo } from "../../api/user";

function reducer(state, action) {
  switch (action.type) {
    case "error":
      return { ...state, error: action.error, success: false, loading: false };
    case "success":
      return { ...state, error: null, success: true, loading: false };
    case "loading":
      return { ...state, loading: true, error: null, success: false };
    case "loading_finished":
      return { ...state, loading: false };
    default:
      return state;
  }
}

const initialState = {
  loading: true,
  success: false,
  error: null,
};

export const PatientPharmacy = () => {
  const { auth } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [pharmacies, setPharmacies] = useState([]);
  const [bigError, setBigError] = useState(null);
  const [name, setName] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPharmacy, setCurrentPharmacy] = useState(null);

  useEffect(() => {
    dispatch({ type: "loading" });
    getPatientInfo(auth.patientId)
      .then((res) => {
        setCurrentPharmacy(res.pharmacy);
      })
      .catch((err) => {
        setBigError("Something went wrong fetching the pharmacies.");
        console.error(err);
      });
    listPharmacies()
      .then(setPharmacies)
      .catch((err) => {
        setBigError("Something went wrong fetching the pharmacies.");
        console.error(err);
      })
      .finally(() => dispatch({ type: "loading_finished" }));
  }, []);

  const handleChangePharmacy = (p) => {
    dispatch({ type: "loading" });
    changePharmacy(auth.patientId, p.id)
      .then((res) => {
        setCurrentPharmacy(p);
        setSuccess("Pharmacy changed");
      })
      .catch((err) => {
        setBigError("Something wennt wrong changing pharmacy.");
        console.error(err);
      })

      .finally(() => dispatch({ type: "loading_finished" }));
  };

  const isMatch = (p) => {
    const search = name.toLowerCase();
    return (
      p.user.first_name.toLowerCase().includes(search) ||
      p.user.last_name.toLowerCase().includes(search)
    );
  };

  return (
    <>
      <Breadcrumb>
        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        <BreadcrumbLink href="/patient/prescriptions">Manage prescriptions</BreadcrumbLink>
      </Breadcrumb>
      <h1>Change Pharmacy</h1>
      <p>
        Use this page to change your pharmacy. This will change where future
        prescriptions are collected from but not current ones.
      </p>

      {bigError && <BigError>{bigError}</BigError>}

      {currentPharmacy ? (
        <p>
          Current pharmacy: {currentPharmacy.user.first_name}{" "}
          {currentPharmacy.user.last_name}
        </p>
      ) : (
        state.loading ? "Loading..." : "No pharmacy"
      )}

      {state.success && (
        <div className="nhsuk-inset-text">
          <span className="nhsuk-u-visually-hidden">Information: </span>
          <p>{state.success}</p>
        </div>
      )}

      <LabelledInput
        value={name}
        onInput={(e) => setName(e.target.value)}
        label="Pharmacy name"
      />

      <Table headings={["Pharmacy name", "Actions"]}>
        {pharmacies.filter(isMatch).map((p) => (
          <Row key={p}>
            <p>
              {p.user.first_name} {p.user.last_name}
            </p>
            <div>
              <Button onClick={() => handleChangePharmacy(p)}>
                Change to this pharmacy
              </Button>
            </div>
          </Row>
        ))}
      </Table>
    </>
  );
};
