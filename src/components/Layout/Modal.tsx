import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Doggo from "./dog.png";

interface ModalDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function ModalDialog({ open, setOpen }: ModalDialogProps) {
  const handleClose = () => {
    setOpen(false);
  };

  const redirectToAvatarX = (name) => {
    window.location.href = `https://demo.avatarx.live?email=${localStorage.getItem(
      "email"
    )}&token=${localStorage.getItem("token")}&name=${name}`;
  };

  const avatars = [
    {
      img: "https://demo.avatarx.live/static/media/avatar-2.912cab5d3e521f02fd53.jpg",
      name: "avatar-2",
      language: "English",
      key: "eyJzb3VsSWQiOiJkZG5hLXVzaGEtbXVzdW51cmktLWVtbWFiZXRhIiwiYXV0aFNlcnZlciI6Imh0dHBzOi8vZGguYXouc291bG1hY2hpbmVzLmNsb3VkL2FwaS9qd3QiLCJhdXRoVG9rZW4iOiJhcGlrZXlfdjFfNWM5MGM3OTEtNTc1ZC00NDgwLTk1YjMtYmYxM2VjNzkxNzAxIn0=",
    },
    {
      img: "https://demo.avatarx.live/static/media/avatar-2.912cab5d3e521f02fd53.jpg",
      name: "avatar-1",
      language: "Hindi",
      key: "eyJzb3VsSWQiOiJkZG5hLXVzaGEtbXVzdW51cmktLWhpbmRpIiwiYXV0aFNlcnZlciI6Imh0dHBzOi8vZGguYXouc291bG1hY2hpbmVzLmNsb3VkL2FwaS9qd3QiLCJhdXRoVG9rZW4iOiJhcGlrZXlfdjFfZDYxOTJlNmItMDE3Ny00ZGNiLThjYTYtYjVmNjRhYzQ3MGZjIn0=",
    },
    {
      img: "https://demo.avatarx.live/static/media/avatar-2.912cab5d3e521f02fd53.jpg",
      name: "avatar-3",
      language: "English Indian",
      key: "eyJzb3VsSWQiOiJkZG5hLXVzaGEtbXVzdW51cmktLWVuZ2xpc2hpbmRpYW4iLCJhdXRoU2VydmVyIjoiaHR0cHM6Ly9kaC5hei5zb3VsbWFjaGluZXMuY2xvdWQvYXBpL2p3dCIsImF1dGhUb2tlbiI6ImFwaWtleV92MV83Y2Y3ODNkNC0xOTE3LTRiMzItYWU5OC1jNzMwNjhkZjYzNWMifQ==",
    },
    {
      img: "https://demo.avatarx.live/static/media/avatar-2.912cab5d3e521f02fd53.jpg",
      name: "avatar-4",
      language: "Arabic",
      key: "eyJzb3VsSWQiOiJkZG5hLXVzaGEtbXVzdW51cmktLWFyYWJpYyIsImF1dGhTZXJ2ZXIiOiJodHRwczovL2RoLmF6LnNvdWxtYWNoaW5lcy5jbG91ZC9hcGkvand0IiwiYXV0aFRva2VuIjoiYXBpa2V5X3YxXzEzMzNjMWU5LWZkYWItNDA0ZC1iODM5LWM5MDlkNTgwYTgzMyJ9",
    },
    {
      img: "https://demo.avatarx.live/static/media/avatar-2.912cab5d3e521f02fd53.jpg",
      name: "avatar-5",
      language: "Indian Telugu",
      key: "eyJzb3VsSWQiOiJkZG5hLXVzaGEtbXVzdW51cmktLWZyZW5jaCIsImF1dGhTZXJ2ZXIiOiJodHRwczovL2RoLmF6LnNvdWxtYWNoaW5lcy5jbG91ZC9hcGkvand0IiwiYXV0aFRva2VuIjoiYXBpa2V5X3YxXzcxMDhmMzdmLWQ5ZjQtNDI5Ny04MTJlLTg0MjE2MDJjMGNiNyJ9",
    },
    {
      img: "https://demo.avatarx.live/static/media/avatar-2.912cab5d3e521f02fd53.jpg",
      name: "avatar-6",
      language: "English Philipines",
      key: "eyJzb3VsSWQiOiJkZG5hLXVzaGEtbXVzdW51cmktLWVuZ2xpc2hwaGlsaXBwaW5lcyIsImF1dGhTZXJ2ZXIiOiJodHRwczovL2RoLmF6LnNvdWxtYWNoaW5lcy5jbG91ZC9hcGkvand0IiwiYXV0aFRva2VuIjoiYXBpa2V5X3YxXzU2M2U5NDJjLTJkZDYtNGM4MS04NjMzLTE1NjNmNWM5M2ViMyJ9",
    },
    {
      img: "https://demo.avatarx.live/static/media/avatar-2.912cab5d3e521f02fd53.jpg",
      name: "avatar-7",
      language: "Spanish Colombia",
      key: "eyJzb3VsSWQiOiJkZG5hLXVzaGEtbXVzdW51cmktLXNwYW5pc2hjb2xvbWJpYSIsImF1dGhTZXJ2ZXIiOiJodHRwczovL2RoLmF6LnNvdWxtYWNoaW5lcy5jbG91ZC9hcGkvand0IiwiYXV0aFRva2VuIjoiYXBpa2V5X3YxXzZhYTg5ZTE1LTI0ZDQtNDE3NC05MTZjLWUzY2I0MmRhZTVjNSJ9",
    },
    // {
    //   disabled: true,
    //   img: Doggo,
    //   name: "Beta",
    //   language: "Multilanguage",
    //   key: "eyJzb3VsSWQiOiJkZG5hLXVzaGEtbXVzdW51cmktLXNwYW5pc2hjb2xvbWJpYSIsImF1dGhTZXJ2ZXIiOiJodHRwczovL2RoLmF6LnNvdWxtYWNoaW5lcy5jbG91ZC9hcGkvand0IiwiYXV0aFRva2VuIjoiYXBpa2V5X3YxXzZhYTg5ZTE1LTI0ZDQtNDE3NC05MTZjLWUzY2I0MmRhZTVjNSJ9",
    // },
  ];

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
          <div className="avatars">
            {avatars.map((avatar, index) => (
              <div
                className="avatar"
                onClick={() => redirectToAvatarX(avatar.name)}
                key={index}
              >
                <img src={avatar.img} />

                <p className="text-center mt-3">
                  <strong>{avatar.language}</strong>
                </p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
