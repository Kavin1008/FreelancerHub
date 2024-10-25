import React, { useEffect, useState, useMemo } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Snackbar,
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Divider,
  List as MuiList,
  ListItem as MuiListItem,
  ListItemIcon,
  ListItemText as MuiListItemText,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";

const AdminFreelancer = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchFreelancers = async () => {
    try {
      setLoading(true);
      const freelancersCollection = collection(db, "Freelancer");
      const freelancerSnapshot = await getDocs(freelancersCollection);
      const freelancerList = freelancerSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFreelancers(freelancerList);
    } catch (err) {
      console.error("Error fetching freelancers:", err);
      setError("Failed to fetch freelancers");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const freelancerCol = collection(db, "Freelancer");
      const q = query(freelancerCol, where("id", "==", id)); // Adjust this if needed

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Assuming there's only one document with the given id
        querySnapshot.forEach(async (docSnapshot) => {
          const freelancerDoc = doc(db, "Freelancer", docSnapshot.id); // Get document reference
          await deleteDoc(freelancerDoc); // Delete the document
          console.log(`Successfully deleted freelancer with ID: ${id}`);
          setSnackbarMessage("Freelancer deleted successfully");
          setSnackbarOpen(true);
          fetchFreelancers(); // Refresh the list
        });
      } else {
        console.error(`No freelancer found with ID: ${id}`);
        setSnackbarMessage("Freelancer not found");
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error("Error deleting freelancer:", err);
      setSnackbarMessage("Failed to delete freelancer");
      setSnackbarOpen(true);
    }
  };

  

  const handleView = (freelancer) => {
    setSelectedFreelancer(freelancer);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedFreelancer(null);
  };

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const freelancerList = useMemo(() => {
    return freelancers.map((freelancer) => (
      <ListItem
        key={freelancer.id}
        sx={{ borderBottom: "1px solid #ccc", padding: "16px" }}
      >
        <ListItemText
          primary={`${freelancer.firstName} ${freelancer.lastName}`}
          secondary={`Skills: ${freelancer.skills} | Email: ${freelancer.email}`}
        />
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleView(freelancer)}
            sx={{ marginRight: 1 }}
          >
            View
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleDelete(freelancer.id)}
          >
            Delete
          </Button>
        </Box>
      </ListItem>
    ));
  }, [freelancers]);

  return (
    <Box padding={3}>
      <Typography variant="h4" marginBottom={2}>
        Freelancer List
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <List>{freelancerList}</List>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Freelancer Details
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          {selectedFreelancer && (
            <Box>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1 }} />
                {`${selectedFreelancer.firstName} ${selectedFreelancer.lastName}`}
              </Typography>
              <MuiList>
                <MuiListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <MuiListItemText primary="Email" secondary={selectedFreelancer.email} />
                </MuiListItem>
                <MuiListItem>
                  <ListItemIcon>
                    <WorkIcon />
                  </ListItemIcon>
                  <MuiListItemText primary="Skills" secondary={selectedFreelancer.skills} />
                </MuiListItem>
                <MuiListItem>
                  <ListItemIcon>
                    <PhoneIcon />
                  </ListItemIcon>
                  <MuiListItemText primary="Phone" secondary={selectedFreelancer.phone || 'N/A'} />
                </MuiListItem>
              </MuiList>
            </Box>
          )}
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" variant="contained" startIcon={<CloseIcon />}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminFreelancer;