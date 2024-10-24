import React from 'react';
import { AppBar, Toolbar, Button, Typography, Box, Grid, Container, Link } from '@mui/material';
import { Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const navigate = useNavigate();
    const handleLoginClick = () => {
        navigate("/login");
    }
    const handleRegisterClick = () => {
        navigate("/register");
    }
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* Header */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar sx={{ px: { xs: 2, lg: 6 }, height: '64px', display: 'flex', alignItems: 'center' }}>
          <Briefcase className="h-6 w-6" />
          <Typography variant="h6" component="div" sx={{ ml: 2, fontWeight: 'bold' }}>
            FreelanceHub
          </Typography>
          <Box sx={{ ml: 'auto', display: 'flex', gap: 2 }}>
            <Button variant="outlined" color="primary" onClick={handleLoginClick}>
              Login
            </Button>
            <Button variant="contained" color="primary" onClick={handleRegisterClick}>
              Register
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Box flex={1} component="main">
        <section style={{ padding: '48px 0' }}>
          <Container maxWidth="md" textAlign="center">
            <Typography variant="h3" fontWeight="bold">
              Find Your Next Freelance Opportunity
            </Typography>
            <Typography color="textSecondary" sx={{ mt: 2, maxWidth: '700px', mx: 'auto' }}>
              Connect with top clients, showcase your skills, and grow your freelance career on FreelanceHub.
            </Typography>
          </Container>
        </section>

        {/* Why Choose FreelanceHub */}
        <Box sx={{ bgcolor: 'background.paper', py: { xs: 6, md: 12 } }}>
          <Container maxWidth="md">
            <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
              Why Choose FreelanceHub
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={4}>
                <Box textAlign="center" p={3} borderRadius={2} border={1} borderColor="grey.300">
                  <Briefcase className="h-8 w-8 mb-2" />
                  <Typography variant="h6" fontWeight="bold">
                    Diverse Projects
                  </Typography>
                  <Typography color="textSecondary">
                    Access a wide range of projects across various industries and skill levels.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box textAlign="center" p={3} borderRadius={2} border={1} borderColor="grey.300">
                  <Briefcase className="h-8 w-8 mb-2" />
                  <Typography variant="h6" fontWeight="bold">
                    Verified Clients
                  </Typography>
                  <Typography color="textSecondary">
                    Work with trusted clients who have been vetted by our platform.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box textAlign="center" p={3} borderRadius={2} border={1} borderColor="grey.300">
                  <Briefcase className="h-8 w-8 mb-2" />
                  <Typography variant="h6" fontWeight="bold">
                    Career Growth
                  </Typography>
                  <Typography color="textSecondary">
                    Build your portfolio, gain experience, and advance your freelance career.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Call to Action */}
        <Box py={12} textAlign="center">
          <Container maxWidth="sm">
            <Typography variant="h4" fontWeight="bold">
              Start Your Freelance Journey Today
            </Typography>
            <Typography color="textSecondary" sx={{ mt: 2 }}>
              Join thousands of freelancers who have found success on our platform. Register now to explore opportunities and showcase your skills.
            </Typography>
            <Button variant="contained" color="primary" size="large" sx={{ mt: 4 }} onClick={handleRegisterClick}>
              Register Now
            </Button>
          </Container>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        alignItems="center"
        py={2}
        px={{ xs: 2, md: 6 }}
        borderTop={1}
        borderColor="grey.300"
      >
        <Typography variant="body2" color="textSecondary">
          © 2024 FreelanceHub. All rights reserved.
        </Typography>
        <Box ml={{ sm: 'auto' }} display="flex" gap={2}>
          <Link href="#" underline="hover" variant="body2">
            Terms of Service
          </Link>
          <Link href="#" underline="hover" variant="body2">
            Privacy
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
