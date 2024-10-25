"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  TextField,
  Button,
  Box,
  Chip,
  Divider,
  IconButton,
  styled,
} from "@mui/material";
import {
  Close as CloseIcon,
  Description,
  Domain,
  Person,
  CalendarToday,
} from "@mui/icons-material";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(3),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: theme.palette.primary.paper,
  color: "black",
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  "& > svg": {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
}));

export default function ProjectPopup({
  open,
  onClose,
  project,
  handleDescriptionChange,
  handleSave,
  description,
}) {
  if (!project) return null;

  return (
    <StyledDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <StyledDialogTitle>
        {project.title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>
      <DialogContent dividers>
        <InfoItem>
          <Description />
          <Typography variant="body1">{project.description}</Typography>
        </InfoItem>
        <InfoItem>
          <Domain />
          <Chip label={project.domain} color="primary" variant="outlined" />
        </InfoItem>
        <InfoItem>
          <Person />
          <Typography variant="body2">Client ID: {project.clientId}</Typography>
        </InfoItem>
        <InfoItem>
          <CalendarToday />
          <Typography variant="body2">
            Posted on: {project.postedDate}
          </Typography>
        </InfoItem>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Enter Description"
            value={description || ""}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            variant="outlined"
            multiline
            required
            rows={4}
            sx={{ mb: 2 }}
          />
          <Button
            onClick={() => {
              if (description && description.trim()) handleSave();
            }}
            variant="contained"
            color="primary"
            fullWidth
            size="large"
          >
            Save Description
          </Button>
        </Box>
      </DialogContent>
    </StyledDialog>
  );
}
