import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TextField } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide() {
  const [open, setOpen] = React.useState(false);
  const [title,setTitle] = React.useState("");
  const [domain, setDomain] = React.useState("");
  const [description, setDescription] = React.useState("");
  console.log(title);
  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Slide in alert dialog
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Post projects"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            variant="outlined"
            helperText="Example : Freelance job managment"
            required
            sx={{ width: "100%" }}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Domain"
            variant="outlined"
            helperText="Example : Full-Stack"
            required
            sx={{ width: "100%" }}
            onChange={(e) => setDomain(e.target.value)}
          />
          <TextField
            label="Description"
            variant="outlined"
            helperText="Example : An intermediate project where freelancers can find job postings, apply for projects, and manage ongoing work. Clients can post projects, hire freelancers, and track progress."
            required
            sx={{ width: "100%" }}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Post</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}