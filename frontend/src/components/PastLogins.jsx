import { useEffect, useState } from "react";
import { getLogins } from "../api/user";
import { Row, Table } from "./Table";
import { Error } from "./Error";

export const PastLogins = () => {
  const [logins, setLogins] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getLogins()
      .then(setLogins)
      .catch((err) => setError(err.data));
  }, []);

  if (error) {
    return <Error>{error}</Error>;
  }

  return (
    <>
      <p>
        These are all successfull logins into your account. Note: This does not
        include sessions started from a saved passwords, only new logins that
        completed the entire login process.
      </p>
      <div class="nhsuk-inset-text">
        <span class="nhsuk-u-visually-hidden">Information: </span>
        <p>
          Don't recognise a login? You should{" "}
          <a href="#Password">change your password.</a>
        </p>
      </div>
      <Table label="Past logins" headings={["Date"]}>
        {logins.map((login) => (
          <Row>
            <div>{new Date(login.timestamp).toLocaleString()}</div>
          </Row>
        ))}
      </Table>
    </>
  );
};
