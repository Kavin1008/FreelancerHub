import React, { useEffect, useState, useMemo } from "react";
import { db } from "../firebase"; // Ensure this path is correct
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
  Divider,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projectsCollection = collection(db, "projects");
      const projectSnapshot = await getDocs(projectsCollection);

      if (projectSnapshot.empty) {
        console.log("No projects found");
        return;
      }

      const projectList = projectSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProjects(projectList);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const projectsCollection = collection(db, "projects");
      const q = query(projectsCollection, where("id", "==", id)); // Assuming 'id' is a field in your documents

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (docSnapshot) => {
          const projectDoc = doc(db, "projects", docSnapshot.id); // Get document reference
          await deleteDoc(projectDoc); // Delete the document
          console.log(`Successfully deleted project with ID: ${id}`);
          setSnackbarMessage("Project deleted successfully");
          setSnackbarOpen(true);
          fetchProjects(); // Refresh the list
        });
      } else {
        console.error(`No project found with ID: ${id}`);
        setSnackbarMessage("Project not found");
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      setSnackbarMessage("Failed to delete project");
      setSnackbarOpen(true);
    }
  };


  const handleView = (project) => {
    setSelectedProject(project);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedProject(null);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const projectList = useMemo(() => {
    return projects.map((project) => (
      <ListItem
        key={project.id}
        sx={{ borderBottom: "1px solid #ccc", padding: "16px" }}
      >
        <ListItemText
          primary={project.title}
          secondary={`Client: ${project.clientName} | Domain: ${project.domain}`}
        />
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleView(project)}
            sx={{ marginRight: 1 }}
          >
            View
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleDelete(project.id)}
          >
            Delete
          </Button>
        </Box>
      </ListItem>
    ));
  }, [projects]);

  return (
    <Box padding={3}>
      <Typography variant="h4" marginBottom={2}>
        Project List
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <List>{projectList}</List>
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
          Project Details
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
          {selectedProject && (
            <Box>
              <Typography variant="h5" gutterBottom>
                {selectedProject.title}
              </Typography>
              <Typography>
                <strong>Client Name:</strong> {selectedProject.clientName}
              </Typography>
              <Typography>
                <strong>Description:</strong> {selectedProject.description}
              </Typography>
              <Typography>
                <strong>Domain:</strong> {selectedProject.domain}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            color="primary"
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminProjects;
