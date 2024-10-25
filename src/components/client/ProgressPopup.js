// ProgressPopup.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Stepper, Step, StepLabel } from '@mui/material';

const steps = [
  "Project Posted",
  "Requested",
  "Accepted",
  "Project Complete",
  "Payment Complete"
];

const ProgressPopup = ({ open, onClose, doc }) => {
  const currentStep = steps.indexOf(doc.status) > -1 ? steps.indexOf(doc.status) : 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Project Details</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <Typography variant="h6">{doc.title}</Typography>
          <Typography variant="body2" color="textSecondary">Proposal ID: {doc.id}</Typography>
          <Typography variant="body1">Freelancer: {doc.freelancerName}</Typography>
          <Typography variant="body1">Status: {doc.status}</Typography>
          <Typography variant="body2" color="textSecondary">
            Accepted Date: {doc.acceptedDate ? new Date(doc.acceptedDate).toLocaleDateString() : "Not accepted yet"}
          </Typography>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={currentStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProgressPopup;
