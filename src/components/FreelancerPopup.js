import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Avatar, Box } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person2';

export default function FreelancerPopup({ open, onClose, freelancer }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
          <PersonIcon />
        </Avatar>
        {freelancer.firstName}'s Profile
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="body1"><strong>Email:</strong> {freelancer.email}</Typography>
          <Typography variant="body1"><strong>Skills:</strong> {freelancer.skills}</Typography>
          <Typography variant="body1"><strong>Experience:</strong> {freelancer.experience? freelancer.experience+"years":"0 years"}</Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
