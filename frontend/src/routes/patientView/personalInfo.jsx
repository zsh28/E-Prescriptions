import {
  useContext,
  useEffect,
  useState,
  useReducer,
  useCallback,
} from "react";
import { SummaryList } from "../../components/SummaryList";
import { AuthContext } from "../../providers/AuthProvider";
import { updatePatient, getPatientInfo } from "../../api/user";
import { BackLink } from "../../components/BackLink";
import { Form, SingleInputForm } from "../../components/Form";
import { Button } from "../../components/Button";
import { BigError } from "../../components/BigError";

const initialFormState = {
  error: null,
  loading: false,
  email: "",
  title: "",
  phone: "",
  postcode: "",

  firstName: "",
  lastName: "",
  dateOfBirth: "",
};

const formReducer = (state, action) => {
  switch (action.type) {
    case "error":
      return { ...state, error: action.payload };
    case "set_value":
      return { ...state, [action.key]: action.payload };
    case "loading":
      return { ...state, error: null, loading: true };
    case "loading_finished":
      return { ...state, loading: false };
    default:
      return state;
  }
};

export const PersonalInfoPage = ({ patientId = null }) => {
  document.title = 'Your Personal Info';
  const { auth } = useContext(AuthContext);

  const [userInfo, setUserInfo] = useState({});
  const [activeForm, setActiveForm] = useState("");
  const [formState, formDispatch] = useReducer(formReducer, initialFormState);
  const [bigError, setBigError] = useState(null);

  patientId ??= auth.patientId;

  const personBeingModified = auth.groups.includes("patient_group")
    ? "your"
    : "patient's";
  const formHeader = <h1>{`Change ${personBeingModified} details`}</h1>;

  const errorDispatcher = (error) => {
    if (error) {
      formDispatch({ type: "error", payload: error.join("\n") });
      return true;
    }
    return false;
  };

  const refreshUserInfo = useCallback(() => {
    getPatientInfo(patientId)
      .then((info) =>
        setUserInfo({
          email: info.user.email,
          title: info.title,
          firstName: info.user.first_name,
          lastName: info.user.last_name,
          phone: info.phone,
          postcode: info.postcode,
          dateOfBirth: info.date_of_birth,
        }),
      )
      .catch((err) => {
        console.error(err);
        setBigError("There was a problem fetching the user information.");
      });
  }, [patientId]);

  const handleUpdatePatient = (data, onError) => {
    // client passes an onError callback that takes the error
    // client can then handle the error and return true if an error was dispatched, or false and onSuccess will be called
    formDispatch({ type: "loading" });
    const onSuccess = () => {
      setActiveForm("");
      refreshUserInfo();
    };
    updatePatient(patientId, data)
      .then(onSuccess)
      .catch((err) => {
        if (!onError(err)) {
          onSuccess(); // client returned false so no error, call onSuccess
        }
      })
      .finally(() => {
        formDispatch({ type: "loading_finished" });
      });
  };

  const handleEmailSubmit = () => {
    handleUpdatePatient({ user: { email: formState.email } }, (err) => {
      const error = err.data.user?.email;
      return errorDispatcher(error);
    });
  };

  const handleTitleSubmit = () => {
    handleUpdatePatient({ title: formState.title }, (err) => {
      const error = err.data.title;
      return errorDispatcher(error);
    });
  };

  const handlePhoneSubmit = () => {
    handleUpdatePatient({ phone: formState.phone }, (err) => {
      const error = err.data.phone;
      return errorDispatcher(error);
    });
  };

  const handlePostcodeSubmit = () => {
    handleUpdatePatient({ postcode: formState.postcode }, (err) => {
      const error = err.data.postcode;
      return errorDispatcher(error);
    });
  };

  const handleFirstNameSubmit = () => {
    handleUpdatePatient(
      { user: { first_name: formState.firstName } },
      (err) => {
        const error = err.data.first_name;
        return errorDispatcher(error);
      },
    );
  };

  const handleLastNameSubmit = () => {
    handleUpdatePatient({ user: { last_name: formState.lastName } }, (err) => {
      const error = err.data.last_name;
      return errorDispatcher(error);
    });
  };

  const handleDateOfBirthSubmit = () => {
    handleUpdatePatient({ date_of_birth: formState.dateOfBirth }, (err) => {
      const error = err.data.date_of_birth;
      return errorDispatcher(error);
    });
  };

  // maps user details to the form used to change them
  const changeInfoMap = {
    email: (
      <SingleInputForm
        header={formHeader}
        id="email"
        label="Email"
        error={formState.error}
        loading={formState.loading}
        onSubmit={handleEmailSubmit}
        value={formState.email}
        onInput={(e) => {
          formDispatch({
            type: "set_value",
            key: "email",
            payload: e.target.value,
          });
        }}
      />
    ),
    title: (
      <Form
        header={formHeader}
        id="title"
        label="Title"
        error={formState.error}
        loading={formState.loading}
        onSubmit={handleTitleSubmit}
      >
        <select
          value={formState.title}
          onInput={(e) => {
            formDispatch({
              type: "set_value",
              key: "title",
              payload: e.target.value,
            });
          }}
          className="nhsuk-select"
          id="title"
          name="title"
        >
          <option disabled value="Title">
            Title
          </option>
          <option value="Mr">Mr</option>
          <option value="Mrs">Mrs</option>
          <option value="Miss">Miss</option>
          <option value="Other">Other</option>
        </select>
      </Form>
    ),
    phone: (
      <SingleInputForm
        header={formHeader}
        id="phone"
        label="Phone"
        error={formState.error}
        loading={formState.loading}
        onSubmit={handlePhoneSubmit}
        value={formState.phone}
        onInput={(e) => {
          formDispatch({
            type: "set_value",
            key: "phone",
            payload: e.target.value,
          });
        }}
      />
    ),
    postcode: (
      <SingleInputForm
        header={formHeader}
        id="postcode"
        label="Postcode"
        error={formState.error}
        loading={formState.loading}
        onSubmit={handlePostcodeSubmit}
        value={formState.postcode}
        onInput={(e) => {
          formDispatch({
            type: "set_value",
            key: "postcode",
            payload: e.target.value,
          });
        }}
      />
    ),
  };

  if (!auth.groups.includes("patient_group")) {
    // not a patient, allow them to change special properties
    changeInfoMap.firstName = (
      <SingleInputForm
        header={formHeader}
        label="First name"
        error={formState.error}
        loading={formState.loading}
        onSubmit={handleFirstNameSubmit}
        value={formState.firstName}
        onInput={(e) => {
          formDispatch({
            type: "set_value",
            key: "firstName",
            payload: e.target.value,
          });
        }}
      />
    );

    changeInfoMap.lastName = (
      <SingleInputForm
        header={formHeader}
        label="Last name"
        error={formState.error}
        loading={formState.loading}
        onSubmit={handleLastNameSubmit}
        value={formState.lastName}
        onInput={(e) => {
          formDispatch({
            type: "set_value",
            key: "lastName",
            payload: e.target.value,
          });
        }}
      />
    );

    changeInfoMap.dateOfBirth = (
      <SingleInputForm
        header={formHeader}
        label="Date of birth"
        error={formState.error}
        loading={formState.loading}
        onSubmit={handleDateOfBirthSubmit}
        value={formState.dateOfBirth}
        onInput={(e) => {
          formDispatch({
            type: "set_value",
            key: "dateOfBirth",
            payload: e.target.value,
          });
        }}
      />
    );
  }

  // map key names to their display name
  const displayMap = {
    email: "E-Mail",
    firstName: "First name",
    lastName: "Last name",
    title: "Title",
    phone: "Phone number",
    postcode: "Postcode",
    dateOfBirth: "Date of birth",
  };

  useEffect(() => {
    refreshUserInfo();
  }, [setUserInfo, auth.userId, refreshUserInfo]);

  if (activeForm) {
    return (
      <>
        <BackLink onClick={() => setActiveForm("")} />
        {changeInfoMap[activeForm]}
      </>
    );
  }

  if (bigError) {
    return <BigError>{bigError}</BigError>;
  }

  return (
    <SummaryList
      items={Object.entries(userInfo).map(([key, value]) => ({
        key: displayMap[key],
        value,
        action:
          key in changeInfoMap ? (
            //<a onClick={() => setActiveForm(key)} href="javascript:void(0)">
            //  Change
            //</a>
            <Button onClick={() => setActiveForm(key)}>Change</Button>
          ) : undefined,
      }))}
    />
  );
};
