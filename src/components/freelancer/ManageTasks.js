import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import {
  CircularProgress, Typography, Box, Card, CardContent, Grid, Container,
  AppBar, Toolbar, Tooltip
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  DateRange as DateRangeIcon,
} from '@mui/icons-material';

const ManageTasks = () => {
  const [acceptedProjects, setAcceptedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get freelancer ID from local storage
  const freelancerId = localStorage.getItem('userUID');

  useEffect(() => {
    const fetchAcceptedProjects = async () => {
      if (!freelancerId) {
        setError("No freelancer ID found in local storage.");
        setLoading(false);
        return;
      }

      try {
       
        const projectsQuery = query(
          collection(db, "proposals"),
          where("freelancerId", "==", freelancerId),
          where("status", "==", "Accepted")
        );
        
        const querySnapshot = await getDocs(projectsQuery);
        const docsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setAcceptedProjects(docsData);
      } catch (error) {
        console.error("Error fetching freelancer's projects: ", error);
        setError("Failed to fetch projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedProjects();
  }, [freelancerId]);

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Typography color="error" variant="h6">{error}</Typography>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Toolbar>
          <AssignmentIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            My Accepted Projects
          </Typography>
          <Typography variant="body2" color="inherit" sx={{ mr: 2 }}>
            Total Projects: {acceptedProjects.length}
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {acceptedProjects.length > 0 ? (
          <Grid container spacing={3}>
            {acceptedProjects.map((project) => (
              <Grid item xs={12} md={6} key={project.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <Tooltip title="Title">
                        <AssignmentIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                      </Tooltip>
                      {project.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      <Tooltip title="Project ID">
                        <span>ID: {project.id}</span>
                      </Tooltip>
                    </Typography>
                    <Typography variant="body1" paragraph>
                      <Tooltip title="Status">
                        <CheckCircleIcon sx={{ verticalAlign: 'middle', mr: 1, color: 'success.main' }} />
                      </Tooltip>
                      {project.status}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <Tooltip title="Accepted Date">
                        <DateRangeIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                      </Tooltip>
                      {project.acceptedDate ? new Date(project.acceptedDate).toLocaleDateString() : "No accepted date"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            height="60vh"
          >
            <Typography variant="body1" color="textSecondary">
              No accepted projects found.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ManageTasks;
