import { useCallback, useContext, useEffect, useReducer, useState } from "react";
import { getModel, updateGP } from "../../api/user";
import { BackLink } from "../../components/BackLink";
import { BigError } from "../../components/BigError";
import { Button } from "../../components/Button";
import { DeleteAccount } from "../../components/DeleteAccount";
import { DownloadDataLink } from "../../components/DownloadDataLink";
import { Expander } from "../../components/Exapander";
import { SingleInputForm } from "../../components/Form";
import { PastLogins } from "../../components/PastLogins";
import { SummaryList } from "../../components/SummaryList";
import { Tab, Tabs } from "../../components/Tabs";
import { AuthContext } from "../../providers/AuthProvider";
import { ChangePasswordForm } from "../patientView/changePassword";

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
  location: "",
  postcode: "",
  phone: "",
};

export const GpAccount = () => {
  document.title = 'Your account';
  const [formState, formDispatch] = useReducer(formReducer, initialFormState);
  const { auth } = useContext(AuthContext);
  const [activeForm, setActiveForm] = useState("");
  const [bigError, setBigError] = useState(null);
  const [userInfo, setUserInfo] = useState({
      email: auth.user.email,
      first_name: auth.user.first_name,
      last_name: auth.user.last_name,
      phone: "",
      location: "",
      postcode: "",
  })


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
                })
            })
            .catch((err) => {
                setBigError(err);
                console.error(err)
            })
    }, [])

    useEffect(refreshUserInfo, [refreshUserInfo]);

  const handleUpdate = (data, onError) => {
    // client passes an onError callback that takes the error
    // client can then handle the error and return true if an error was dispatched, or false and onSuccess will be called
    formDispatch({ type: "loading" });
    const onSuccess = () => {
      setActiveForm("");
      refreshUserInfo();
    };
    updateGP(auth.gpId, data)
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
        console.log("err", err)
      const error = err.data.user?.email;
      return errorDispatcher(error);
    });
  };


  const handleFirstNameSubmit = () => {
    handleUpdate(
      { user: { first_name: formState.firstName } },
      (err) => {
        const error = err.data.user?.first_name;
        return errorDispatcher(error);
      },
    );
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

  const handleLocationSubmit = () => {
    handleUpdate({ location: formState.location }, (err) => {
      const error = err.data.location;
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
    "Location": {
      value: userInfo.location,
      form: (
        <SingleInputForm
          label="Phone"
          error={formState.error}
          loading={formState.loading}
          value={formState.location}
          onSubmit={handleLocationSubmit}
          onInput={(e) => {
            formDispatch({
              type: "set_value",
              key: "location",
              payload: e.target.value,
            });
          }}
        />
      ),
    },
  };

  return (
    <>

      {
          bigError && <BigError><p>{JSON.stringify(bigError)}</p></BigError>
      }
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
