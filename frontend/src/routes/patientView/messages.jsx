import { useEffect, useState } from "react";
import { Table, Row } from "../../components/Table";
import {
  acceptInvite,
  deleteInvite,
  getInvites,
  getMessages,
  markMessageRead,
} from "../../api/patient";
import { BigError } from "../../components/BigError";
import { Button } from "../../components/Button";
import { timeSinceDate } from "../../utils/timeSinceDate";

export const PatientMessages = () => {
  document.title = 'Messages';
  const [bigError, setBigError] = useState(null);
  const [invites, setInvites] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    getInvites()
      .then((res) => {
        setInvites(res.filter((x) => x.status === "PENDING"));
      })
      .catch((err) => {
        setBigError(err);
        console.error(err);
      });

    getMessages()
      .then((res) => {
        setMessages(res);
      })
      .catch((err) => {
        setBigError(err);
        console.error(err);
      });
  }, []);

  const handleInviteDelete = (invite) => {
    deleteInvite(invite.id)
      .then(() => {
        setInvites((invites) => invites.filter((x) => x.id !== invite.id));
      })
      .catch((err) => {
        console.error(err);
        setBigError("Something went wrong declining that invite.");
      });
  };

  const handleInviteAccept = (invite) => {
    acceptInvite(invite.id)
      .then(() => {
        setInvites((invites) => invites.filter((x) => x.id !== invite.id));
      })
      .catch((err) => {
        console.error(err);
        setBigError("Something went wrong accepting that invite.");
      });
  };

  const markAsRead = (msg) => {
    markMessageRead(msg.id)
      .then(() => {
        setMessages((messages) =>
          messages.map((x) => (x.id === msg.id ? { ...msg, read: true } : x)),
        );
      })

      .catch((err) => {
        console.error(err);
        setBigError("Something went wrong when marking that message as read.");
      });
  };

  return (
    <>
      {bigError && <BigError>{bigError}</BigError>}

      <h1>Messages</h1>

      <p>
        These are messages sent directly from your GP/Doctor, or from the
        system.
      </p>

      <Table headings={["From", "Message", "Action"]}>
        {invites.map((invite) => (
          <Row key={invite}>
            <div>{invite.gp.name}</div>
            <div>You are invited to join this GP</div>

            <div>
              <Button onClick={() => handleInviteAccept(invite)}>Accept</Button>
              <Button onClick={() => handleInviteDelete(invite)}>
                Decline
              </Button>
            </div>
          </Row>
        ))}

        {messages.map((msg) => (
          <Row key={msg}>
            <div>
              Your GP/Doctor
              <br />
              <div className="small">
                ({timeSinceDate(new Date(msg.date_created))})
              </div>
            </div>
            <div>{msg.text}</div>

            <div>
              {!msg.read && (
                <Button onClick={() => markAsRead(msg)}>Mark as read</Button>
              )}
            </div>
          </Row>
        ))}
      </Table>
    </>
  );
};
