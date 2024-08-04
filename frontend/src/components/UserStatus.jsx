import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

export const UserStatus = () => {
  const { auth } = useContext(AuthContext);

  const [tagColour, tagName] = (function () {
    switch (auth.groups[0]) {
      case "patient_group":
        return ["white", "Patient"];
      case "doctor_group":
        return ["blue", "Doctor"];
      case "gp_group":
        return ["yellow", "GP"];
      case "pharmacy_group":
        return ["purple", "Pharmacy"];
      default:
        return ["grey", "???"];
    }
  })();

  return (
    <div>
      <div
        style={{
          display: "inline",
          color: "white",
          margin: "0 10px",
        }}
      >
        {auth.firstName} {auth.lastName}
      </div>
      <strong className={`nhsuk-tag nhsuk-tag--${tagColour}`}>{tagName}</strong>
    </div>
  );
};
