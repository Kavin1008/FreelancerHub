"use client";

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
  Paper,
  Container,
  Alert,
  ListItemIcon,
  Chip,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  Phone as PhoneIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
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
    const confirmed = window.confirm("Are you sure you want to delete this freelancer?");
    if (!confirmed) return;

    setLoading(true);

    try {
      const freelancerCol = collection(db, "Freelancer");
      const q = query(freelancerCol, where("id", "==", id));

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (docSnapshot) => {
          const freelancerDoc = doc(db, "Freelancer", docSnapshot.id);
          await deleteDoc(freelancerDoc);
          console.log(`Successfully deleted freelancer with ID: ${id}`);
          setSnackbarMessage("Freelancer deleted successfully");
          setSnackbarOpen(true);
          fetchFreelancers();
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
    } finally {
      setLoading(false);
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
        sx={{
          borderBottom: "1px solid #e0e0e0",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        <ListItemIcon>
          <PersonIcon color="primary" />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography variant="subtitle1">{`${freelancer.firstName} ${freelancer.lastName}`}</Typography>
          }
          secondary={
            <Box>
              <Typography variant="body2" color="text.secondary">
                {freelancer.email}
              </Typography>
              <Box mt={1}>
                {freelancer.skills.split(',').map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill.trim()}
                    size="small"
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>
            </Box>
          }
        />
        <Box>
          <IconButton
            color="primary"
            onClick={() => handleView(freelancer)}
            sx={{ mr: 1 }}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(freelancer.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </ListItem>
    ));
  }, [freelancers]);

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Freelancer List
        </Typography>
        <Paper elevation={3}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <List>{freelancerList}</List>
          )}
        </Paper>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Freelancer Details
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: "absolute",
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
              <Typography
                variant="h5"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <PersonIcon sx={{ mr: 1 }} color="primary" />
                {`${selectedFreelancer.firstName} ${selectedFreelancer.lastName}`}
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={selectedFreelancer.email}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <WorkIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Skills"
                    secondary={
                      <Box mt={1}>
                        {selectedFreelancer.skills.split(',').map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill.trim()}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone"
                    secondary={selectedFreelancer.phone || "N/A"}
                  />
                </ListItem>
              </List>
            </Box>
          )}
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            color="primary"
            variant="contained"
            startIcon={<CloseIcon />}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminFreelancer;