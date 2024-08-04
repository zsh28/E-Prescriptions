import {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { getModel, updateDoctor} from "../../api/user";
import { BackLink } from "../../components/BackLink";
import { BigError } from "../../components/BigError";
import { Button } from "../../components/Button";
import { Expander } from "../../components/Exapander";
import { SingleInputForm } from "../../components/Form";
import { SummaryList } from "../../components/SummaryList";
import { Tab, Tabs } from "../../components/Tabs";
import {Form} from "../../components/Form";
import { AuthContext } from "../../providers/AuthProvider";
import { ChangePasswordForm } from "../patientView/changePassword";
import { DownloadDataLink } from "../../components/DownloadDataLink";
import { PastLogins } from "../../components/PastLogins";
import { DeleteAccount } from "../../components/DeleteAccount";

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

const initialFormState = {
  error: null,
  loading: false,
  email: "",
  firstName: "",
  lastName: "",
  title: "Title",
  phone: "",
};

export const DoctorAccount = () => {
  document.title = "Your account";
  const [formState, formDispatch] = useReducer(formReducer, initialFormState);
  const { auth } = useContext(AuthContext);
  const [activeForm, setActiveForm] = useState("");
  const [bigError, setBigError] = useState(null);
  const [userInfo, setUserInfo] = useState({
    email: auth.user.email,
    first_name: auth.user.first_name,
    last_name: auth.user.last_name,
    title: "",
    phone: "",
  });

  const errorDispatcher = (error) => {
    if (error) {
      formDispatch({ type: "error", payload: error.join("\n") });
      return true;
    }
    return false;
  };

  const refreshUserInfo = useCallback(() => {
    getModel()
      .then((model) => {
        setUserInfo({
          ...model,
          ...model.user,
        });
      })
      .catch((err) => {
        setBigError(err);
        console.error(err);
      });
  }, []);

  useEffect(refreshUserInfo, [refreshUserInfo]);

  const handleUpdate = (data, onError) => {
    // client passes an onError callback that takes the error
    // client can then handle the error and return true if an error was dispatched, or false and onSuccess will be called
    formDispatch({ type: "loading" });
    const onSuccess = () => {
      setActiveForm("");
      refreshUserInfo();
    };
    updateDoctor(auth.doctorId, data)
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

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    handleUpdate({ user: { email: formState.email } }, (err) => {
      console.log("err", err);
      const error = err.data.user?.email;
      return errorDispatcher(error);
    });
  };

  const handleFirstNameSubmit = () => {
    handleUpdate({ user: { first_name: formState.firstName } }, (err) => {
      const error = err.data.user?.first_name;
      return errorDispatcher(error);
    });
  };

  const handleLastNameSubmit = () => {
    handleUpdate({ user: { last_name: formState.lastName } }, (err) => {
      const error = err.data.user?.last_name;
      return errorDispatcher(error);
    });
  };

  const handlePhoneSubmit = () => {
    handleUpdate({ phone: formState.phone }, (err) => {
      const error = err.data.phone;
      return errorDispatcher(error);
    });
  };

  const handleTitleSubmit = () => {
    handleUpdate({ title: formState.title }, (err) => {
      const error = err.data.title;
      return errorDispatcher(error);
    });
  };

  const infoItems = {
    "E-Mail": {
      value: userInfo.email,
      form: (
        <SingleInputForm
          label="E-Mail"
          error={formState.error}
          loading={formState.loading}
          value={formState.email}
          onSubmit={handleEmailSubmit}
          onInput={(e) => {
            formDispatch({
              type: "set_value",
              key: "email",
              payload: e.target.value,
            });
          }}
        />
      ),
    },
    Title: {
      value: userInfo.title,
      form: (
        <Form
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
            <option value="Dr">Dr</option>
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
            <option value="Miss">Miss</option>
            <option value="Other">Other</option>
          </select>
        </Form>
      ),
    },
    "First name": {
      value: userInfo.first_name,
      form: (
        <SingleInputForm
          label="First name"
          error={formState.error}
          value={formState.firstName}
          loading={formState.loading}
          onSubmit={handleFirstNameSubmit}
          onInput={(e) => {
            formDispatch({
              type: "set_value",
              key: "firstName",
              payload: e.target.value,
            });
          }}
        />
      ),
    },
    "Last name": {
      value: userInfo.last_name,
      form: (
        <SingleInputForm
          label="Last name"
          error={formState.error}
          value={formState.lastName}
          loading={formState.loading}
          onSubmit={handleLastNameSubmit}
          onInput={(e) => {
            formDispatch({
              type: "set_value",
              key: "lastName",
              payload: e.target.value,
            });
          }}
        />
      ),
    },

    "Phone number": {
      value: userInfo.phone,
      form: (
        <SingleInputForm
          label="Phone"
          error={formState.error}
          value={formState.phone}
          loading={formState.loading}
          onSubmit={handlePhoneSubmit}
          onInput={(e) => {
            formDispatch({
              type: "set_value",
              key: "phone",
              payload: e.target.value,
            });
          }}
        />
      ),
    },
  };

  return (
    <>
      {bigError && (
        <BigError>
          <p>{JSON.stringify(bigError)}</p>
        </BigError>
      )}
      <Tabs>
        <Tab label="Personal information">
          {activeForm ? (
            <>
              <BackLink onClick={() => setActiveForm("")} />
              {infoItems[activeForm].form}
            </>
          ) : (
            <SummaryList
              items={Object.entries(infoItems).map(([key, { value }]) => ({
                key: key,
                value: value,
                action: (
                  <Button onClick={() => setActiveForm(key)}>Change</Button>
                ),
              }))}
            />
          )}
        </Tab>

        <Tab label="Password">
          <ChangePasswordForm />
        </Tab>

        <Tab label="Manage account">
          <Expander title="Delete my account">
            <p>aahhh</p>
          </Expander>
          <Expander title="Past logins">
            <PastLogins />
          </Expander>
          <Expander title="Download my data">
            <DownloadDataLink />
         </Expander>
          <Expander title="Delete my account">
            <DeleteAccount />
         </Expander>
        </Tab>
      </Tabs>
    </>
  );
};
