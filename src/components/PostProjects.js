import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TextField } from "@mui/material";

import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({ setOpen, open }) {
  const [title, setTitle] = React.useState("");
  const [domain, setDomain] = React.useState("");
  const [description, setDescription] = React.useState("");

  const handleClose = () => {
    setOpen(false);
    clearFields();
  };

  const clearFields = () => {
    setTitle("");
    setDomain("");
    setDescription("");
  };

  const handlePost = async () => {
    try {
      // Add a new document with a generated ID
      const id = localStorage.getItem('userID');
      await addDoc(collection(db, "projects"), {
        id,
        title,
        domain,
        description,
        postedDate: new Date().toISOString(), // Optionally include the posted date
      });
      console.log("Document successfully written!");
      handleClose(); // Close dialog after posting
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <React.Fragment>
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
            helperText="Example: Freelance job management"
            required
            sx={{ width: "100%" }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Domain"
            variant="outlined"
            helperText="Example: Full-Stack"
            required
            sx={{ width: "100%" }}
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
          <TextField
            label="Description"
            variant="outlined"
            helperText="Example: An intermediate project where freelancers can find job postings, apply for projects, and manage ongoing work."
            required
            sx={{ width: "100%" }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handlePost}
            disabled={!title || !domain || !description}
          >
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
