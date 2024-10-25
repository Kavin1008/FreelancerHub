import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // Adjust path based on your Firebase config file
import { Box, Card, CardContent, Typography, CircularProgress, Grid } from '@mui/material';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch projects from Firestore
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'projects'));
        const projectsArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(projectsArray);
      } catch (error) {
        console.error('Error fetching projects: ', error);
      } finally {
        setLoading(false); // Stop loading spinner after fetching
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        All Posted Projects
      </Typography>
      <Grid container spacing={3}>
        {projects.length > 0 ? (
          projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    {project.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {project.description}
                  </Typography>
                  <Typography variant="body2">
                    Posted by: {project.clientName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Budget: {project.budget}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Date Posted: {new Date(project.datePosted?.seconds * 1000).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1">No projects found.</Typography>
        )}
      </Grid>
    </Box>
  );
}
