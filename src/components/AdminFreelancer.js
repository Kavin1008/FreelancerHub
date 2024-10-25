// AdminFreelancer.js
import React, { useEffect, useState, useMemo } from "react";
import { db } from "./firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
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
} from "@mui/material";

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
      const freelancerDoc = doc(db, "Freelancer", id);
      await deleteDoc(freelancerDoc);
      setSnackbarMessage("Freelancer deleted successfully");
      setSnackbarOpen(true);
      fetchFreelancers(); // Refresh the list
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
          secondary={`Skills: ${freelancer.skills} | Email: ${
            freelancer.email
          }`}
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

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Freelancer Details</DialogTitle>
        <DialogContent>
          {selectedFreelancer && (
            <Box>
              <Typography variant="h6">{`${selectedFreelancer.firstName} ${selectedFreelancer.lastName}`}</Typography>
              <Typography>Email: {selectedFreelancer.email}</Typography>
              <Typography>Skills: {selectedFreelancer.skills}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminFreelancer;
