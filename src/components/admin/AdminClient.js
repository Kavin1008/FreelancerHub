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
  List as MuiList,
  ListItem as MuiListItem,
  ListItemIcon,
  ListItemText as MuiListItemText,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Phone as PhoneIcon,
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
    console.log(id);
    
  const confirmed = window.confirm("Are you sure you want to delete this client?");
  if (!confirmed) return;

  setLoading(true); // Assuming you have a loading state

  try {
    const clientCol = collection(db, "Client");
    const q = query(clientCol, where("id", "==", id));
    console.log(`Attempting to delete client with ID: ${id}`);

    // Fetch the document(s) matching the query
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      // Assuming there's only one document with the given id
      querySnapshot.forEach(async (docSnapshot) => {
        const clientDocRef = doc(db, "Client", docSnapshot.id); // Get document reference
        await deleteDoc(clientDocRef); // Delete the document
        console.log(`Successfully deleted client with ID: ${id}`);
        setSnackbarMessage("Client deleted successfully");
        setSnackbarOpen(true);
        fetchClients(); // Refresh the client list
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
    setLoading(false); // Reset loading state
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
        sx={{ borderBottom: "1px solid #ccc", padding: "16px" }}
      >
        <ListItemText
          primary={`${client.firstName} ${client.lastName}`}
          secondary={`${client.email}`}
        />
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleView(client)}
            sx={{ marginRight: 1 }}
          >
            View
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleDelete(client.id)}
          >
            Delete
          </Button>
        </Box>
      </ListItem>
    ));
  }, [clients]);

  return (
    <Box padding={3}>
      <Typography variant="h4" marginBottom={2}>
        Client List
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <List>{clientList}</List>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />

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
                <PersonIcon sx={{ mr: 1 }} />
                {`${selectedClient.firstName} ${selectedClient.lastName}`}
              </Typography>
              <MuiList>
                <MuiListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <MuiListItemText
                    primary="Email"
                    secondary={selectedClient.email}
                  />
                </MuiListItem>
                <MuiListItem>
                  <ListItemIcon>
                    <BadgeIcon />
                  </ListItemIcon>
                  <MuiListItemText
                    primary="User Type"
                    secondary={selectedClient.usertype}
                  />
                </MuiListItem>
                <MuiListItem>
                  <ListItemIcon>
                    <PhoneIcon />
                  </ListItemIcon>
                  <MuiListItemText
                    primary="Phone"
                    secondary={selectedClient.phone || "N/A"}
                  />
                </MuiListItem>
              </MuiList>
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
    </Box>
  );
};

export default AdminClient;
