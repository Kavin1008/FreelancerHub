import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TextField } from "@mui/material";
import { collection, addDoc, query, getDocs, where } from "firebase/firestore"; // Import getDoc for fetching client data
import { db } from "./firebase";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({ setOpen, open }) {
  const [title, setTitle] = React.useState("");
  const [domain, setDomain] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [clientData, setClientData] = React.useState(null); // Store client details here

  const handleClose = () => {
    setOpen(false);
    clearFields();
  };

  const clearFields = () => {
    setTitle("");
    setDomain("");
    setDescription("");
  };

  // Fetch client data on component mount

React.useEffect(() => {
  const fetchClientData = async () => {
    try {
      const userId = localStorage.getItem('userUID'); // Get userId from localStorage
      console.log(userId);
      
      if (userId) {
        // Use query to find the document where 'id' matches userId
        const q = query(collection(db, 'Client'), where('id', '==', userId));
        const querySnapshot = await getDocs(q); // Fetch all documents that match the query

        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            // Assuming there's only one matching document, store the client data
            setClientData(doc.data());
            console.log("Client data: ", doc.data());
          });
        } else {
          console.log("No such client found");
        }
      }
    } catch (error) {
      console.error("Error fetching client data: ", error);
    }
  };

  fetchClientData();
}, []);


  const handlePost = async () => {
    try {
      // Get userId from localStorage
      const userId = localStorage.getItem("userUID");
      console.log(clientData);
      
      if (userId && clientData) {
        // Add a new document with the client details and project information
        await addDoc(collection(db, "projects"), {
          clientId: userId,
          clientName: clientData.firstName, // Assuming clientData has a 'name' field
          title,
          domain,
          status:"Posted",
          description,
          postedDate: new Date().toISOString(), // Optionally include the posted date
        });
        console.log("Document successfully written!");
        handleClose(); // Close dialog after posting
      }
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
