// Client.js
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
    try {
      console.log(`Attempting to delete client with ID: ${id}`);
      const clientDoc = doc(db, "Client", id);
      await deleteDoc(clientDoc);
      console.log(`Successfully deleted client with ID: ${id}`);
      setSnackbarMessage("Client deleted successfully");
      setSnackbarOpen(true);
      fetchClients(); // Refresh the client list
    } catch (err) {
      console.error("Error deleting client:", err);
      setSnackbarMessage("Failed to delete client");
      setSnackbarOpen(true);
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
          secondary={`User Type: ${client.usertype}`}
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

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Client Details</DialogTitle>
        <DialogContent>
          {selectedClient && (
            <Box>
              <Typography variant="h6">{`${selectedClient.firstName} ${selectedClient.lastName}`}</Typography>
              <Typography>{selectedClient.email}</Typography>
              {/* Add more fields as necessary */}
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

export default AdminClient;
