"use client";

import React, { useEffect, useState, useMemo } from "react";
import { db } from "../firebase"; // Ensure this path is correct
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
  Divider,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";

// Styled components for the dialog
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "12px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2),
  position: "relative",
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const DetailItem = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

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
      const projectDoc = doc(db, "Projects", id);
      await deleteDoc(projectDoc);
      setSnackbarMessage("Project deleted successfully");
      setSnackbarOpen(true);
      fetchProjects(); // Refresh the list
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

      <StyledDialog open={dialogOpen} onClose={handleCloseDialog}>
        <StyledDialogTitle>
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
        </StyledDialogTitle>
        <Divider />
        <StyledDialogContent>
          {selectedProject && (
            <Box>
              <DetailItem variant="h6">{selectedProject.title}</DetailItem>
              <DetailItem>
                <strong>Client Name:</strong> {selectedProject.clientName}
              </DetailItem>
              <DetailItem>
                <strong>Description:</strong> {selectedProject.description}
              </DetailItem>
              <DetailItem>
                <strong>Domain:</strong> {selectedProject.domain}
              </DetailItem>
            </Box>
          )}
        </StyledDialogContent>
        <Divider />
        <StyledDialogActions>
          <Button
            onClick={handleCloseDialog}
            color="primary"
            variant="contained"
          >
            Close
          </Button>
        </StyledDialogActions>
      </StyledDialog>
    </Box>
  );
};

export default AdminProjects;
