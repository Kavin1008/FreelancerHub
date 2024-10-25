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
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Phone as PhoneIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

const AdminClient = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const clientsCollection = collection(db, "Client");
      const clientSnapshot = await getDocs(clientsCollection);
      const clientList = clientSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClients(clientList);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError("Failed to fetch clients");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this client?");
    if (!confirmed) return;

    setLoading(true);

    try {
      const clientCol = collection(db, "Client");
      const q = query(clientCol, where("id", "==", id));
      console.log(`Attempting to delete client with ID: ${id}`);

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (docSnapshot) => {
          const clientDocRef = doc(db, "Client", docSnapshot.id);
          await deleteDoc(clientDocRef);
          console.log(`Successfully deleted client with ID: ${id}`);
          setSnackbarMessage("Client deleted successfully");
          setSnackbarOpen(true);
          fetchClients();
        });
      } else {
        console.error(`No client found with ID: ${id}`);
        setSnackbarMessage("Client not found");
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error("Error deleting client:", err);
      setSnackbarMessage("Failed to delete client. Please try again.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (client) => {
    setSelectedClient(client);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedClient(null);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const clientList = useMemo(() => {
    return clients.map((client) => (
      <ListItem
        key={client.id}
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
            <Typography variant="subtitle1">{`${client.firstName} ${client.lastName}`}</Typography>
          }
          secondary={
            <Typography variant="body2" color="text.secondary">
              {client.email}
            </Typography>
          }
        />
        <Box>
          <IconButton
            color="primary"
            onClick={() => handleView(client)}
            sx={{ mr: 1 }}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(client.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </ListItem>
    ));
  }, [clients]);

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Client List
        </Typography>
        <Paper elevation={3}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <List>{clientList}</List>
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
          Client Details
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
          {selectedClient && (
            <Box>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <PersonIcon sx={{ mr: 1 }} color="primary" />
                {`${selectedClient.firstName} ${selectedClient.lastName}`}
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={selectedClient.email}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <BadgeIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="User Type"
                    secondary={selectedClient.usertype}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone"
                    secondary={selectedClient.phone || "N/A"}
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

export default AdminClient;