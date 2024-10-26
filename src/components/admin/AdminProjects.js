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
  Divider,
  IconButton,
  Paper,
  Container,
  Alert,
  ListItemIcon,
  ThemeProvider,
  createTheme,
  Chip,
} from "@mui/material";
import { styled } from "@mui/system";
import {
  Close as CloseIcon,
  Folder as FolderIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  Language as LanguageIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";


const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const StyledDialog = styled(Dialog)(() => ({
  "& .MuiDialog-paper": {
    borderRadius: "12px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main || '#1976d2',
  color: theme.palette.primary.contrastText || '#ffffff',
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
        setProjects([]);
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
    const confirmed = window.confirm("Are you sure you want to delete this project?");
    if (!confirmed) return;

    setLoading(true);

    try {
      const projectCol = collection(db, "projects");
      const q = query(projectCol, where("id", "==", id));

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (docSnapshot) => {
          const projectDoc = doc(db, "projects", docSnapshot.id);
          await deleteDoc(projectDoc);
          console.log(`Successfully deleted project with ID: ${id}`);
          setSnackbarMessage("Project deleted successfully");
          setSnackbarOpen(true);
          fetchProjects();
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
    } finally {
      setLoading(false);
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
        sx={{
          borderBottom: "1px solid #e0e0e0",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        <ListItemIcon>
          <FolderIcon color="primary" />
        </ListItemIcon>
        <ListItemText
          primary={<Typography variant="subtitle1">{project.title}</Typography>}
          secondary={
            <Typography variant="body2" color="text.secondary">
              Client: {project.clientName} | Domain: {project.domain}
            </Typography>
          }
        />
        <Box>
          <IconButton
            color="primary"
            onClick={() => handleView(project)}
            sx={{ mr: 1 }}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(project.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </ListItem>
    ));
  }, [projects]);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Project List
          </Typography>
          <Paper elevation={3}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : projects.length === 0 ? (
              <Alert severity="info">No projects found</Alert>
            ) : (
              <List>{projectList}</List>
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

        <StyledDialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <StyledDialogTitle>
            Project Details
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[100],
              }}
            >
              <CloseIcon />
            </IconButton>
          </StyledDialogTitle>
          <Divider />
          <StyledDialogContent>
            {selectedProject && (
              <Box>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <FolderIcon sx={{ mr: 1 }} color="primary" />
                  {selectedProject.title}
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Client Name"
                      secondary={selectedProject.clientName}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <DescriptionIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Description"
                      secondary={selectedProject.description}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LanguageIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Domain"
                      secondary={selectedProject.domain}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <WorkIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Skills Required"
                      secondary={
                        <Box mt={1}>
                          {selectedProject.skillsRequired?.split(',').map((skill, index) => (
                            <Chip
                              key={index}
                              label={skill.trim()}
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          )) || "N/A"}
                        </Box>
                      }
                    />
                  </ListItem>
                </List>
              </Box>
            )}
          </StyledDialogContent>
          <Divider />
          <StyledDialogActions>
            <Button
              onClick={handleCloseDialog}
              color="primary"
              variant="contained"
              startIcon={<CloseIcon />}
            >
              Close
            </Button>
          </StyledDialogActions>
        </StyledDialog>
      </Container>
    </ThemeProvider>
  );
};

export default AdminProjects;