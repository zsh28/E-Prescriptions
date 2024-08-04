import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { register } from "../../api/user";
import { BackLink } from "../../components/BackLink";
import { Credentials } from "./credentials";
import { DateOfBirth } from "./dateOfBirth";
import { Name } from "./name";

const initialState = {
  pageIndex: 0,
  dateOfBirth: null,
  title: null,
  firstName: null,
  lastName: null,
  postcode: null,
  phone: null,
  email: null,
  password: null,
};

export const RegisterContext = createContext();

export const RegisterType = {
  NEXT_PAGE: 0,
  PREV_PAGE: 1,
  SET_DATE_OF_BIRTH: 2,
  SET_PERSONAL_INFO: 3,
  SET_CREDENTIALS: 4,
};

function reducer(state, action) {
  switch (action.type) {
    case RegisterType.SET_PERSONAL_INFO:
      return {
        ...state,
        ...action.payload,
      };
    case RegisterType.SET_DATE_OF_BIRTH:
      return {
        ...state,
        dateOfBirth: action.payload,
      };
    case RegisterType.SET_CREDENTIALS:
      return {
        ...state,
        email: action.email,
        password: action.password,
      };
    case RegisterType.NEXT_PAGE:
      return {
        ...state,
        pageIndex: state.pageIndex + 1,
      };
    case RegisterType.PREV_PAGE:
      return {
        ...state,
        pageIndex: state.pageIndex - 1,
      };
    default:
      return initialState;
  }
}

const Register = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);

  const RegisterUser = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState("Please wait...");

    useEffect(() => {
      register({
        user: {
          first_name: state.firstName,
          last_name: state.lastName,
          email: state.email,
          password: state.password,
        },
        title: state.title,
        phone: state.phone,
        postcode: state.postcode,
        date_of_birth: state.dateOfBirth,
      })
        .then((res) => {
            navigate("/login", { state: { registerSuccess: true } })
        })
        .catch((err) => {
          setMessage("Sorry, there was an error trying to register you.");
        });
    }, []);
    return <div>{message}</div>;
  };

  const pages = [<Name />, <DateOfBirth />, <Credentials />];

  const handleBack = () => {
    if (state.pageIndex === 0) {
      // go back into browser history
      navigate(-1);
    } else {
      dispatch({ type: RegisterType.PREV_PAGE });
    }
  };

  return (
    <RegisterContext.Provider value={{ state, dispatch }}>
      <BackLink onClick={handleBack} />
      <h1 className="nhsuk-heading-xl">Register for the service</h1>
      <p className="nhsuk-body">
        In order to register we will need a few details about you.
        {/* TODO: add any required documents/numbers */}
      </p>

      {state.pageIndex === pages.length ? (
        <RegisterUser />
      ) : (
        pages.map((page, index) => {
          return (
            <div
              key={index}
              style={{ display: index === state.pageIndex ? "" : "none" }}
            >
              {pages[index]}
            </div>
          );
        })
      )}
    </RegisterContext.Provider>
  );
};

export default Register;
