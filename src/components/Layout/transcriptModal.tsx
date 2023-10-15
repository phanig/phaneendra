import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ChatBox from "./ChatBox";

interface ModalDialogProps {
  open: boolean;
  user: string;
  avatar: string;
  setOpen: (value: boolean) => void;
}

export default function TranscriptModalDialog({
  open,
  setOpen,
  user,
  avatar,
}: ModalDialogProps) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <ChatBox />
      </Dialog>
    </div>
  );
}
