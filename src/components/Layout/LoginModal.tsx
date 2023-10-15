import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useEffect, useState } from "react";
import GoogleButton from "react-google-button";

interface ModalDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function LoginModalDialog({ open, setOpen }: ModalDialogProps) {
  const [user, setUser] = useState([]);
  const [emails, setEmails] = useState([]);

  const getEmails = () => {
    axios
      .get(`https://api.avatarx.live/api/whitelisted-emails/`, {
        headers: {
          Accept: "application/json",
        },
      })
      .then((res) => {
        let emails = res.data;
        setEmails(emails);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getEmails();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse: any) => setUser(codeResponse.access_token),
    onError: (error: any) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user}`,
          {
            headers: {
              Authorization: `Bearer ${user}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          if (!emails.includes(res.data.email)) {
            alert("You don't have access to this page .. ");
            return;
          } else {
            console.log("***google Info**", res.data);
            console.log("datadogrum");
            localStorage.setItem("userInfo", JSON.stringify(res.data));
            handleClose();
          }
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Select your avatar ..."}
        </DialogTitle>
        <DialogContent>
          <GoogleButton onClick={() => login()} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
