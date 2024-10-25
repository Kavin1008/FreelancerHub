import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Avatar, Box, Button, Menu, MenuItem, Chip, Stack } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person2';
import {  collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebase'; // Make sure your Firebase config is exported from this file

const availableSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'Firebase', 'CSS', 'HTML'];

export default function FreelancerPopup({ open, onClose, freelancer, onSave }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]); // Initialize as an empty array if skills are missing
    useEffect(() => {
        if (freelancer && freelancer.skills) {
          setSelectedSkills(freelancer.skills.split(', ')); // Set selectedSkills from freelancer's skills
        } else {
          setSelectedSkills([]); // Reset to empty array if no skills
        }
      }, [freelancer]);
    
    
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleAddSkill = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]); // Add the new skill to the state
    }
    handleCloseMenu();
  };

  const handleSave = async () => {
    try {
      // Query the Freelancer collection to find the document with the matching id field
      const q = query(collection(db, 'Freelancer'), where('id', '==', freelancer.id));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        console.error("No document found with the specified id field!");
        return; // Stop execution if no document is found
      }
  
      // Assuming there's only one document matching the id
      const freelancerDoc = querySnapshot.docs[0]; // Get the first matching document
      const freelancerRef = freelancerDoc.ref; // Get the document reference
  
      // Proceed to update the document
      await updateDoc(freelancerRef, {
        skills: selectedSkills.join(', ') // Save as a comma-separated string
      });
  
      // Call the onSave prop function (if needed for parent component actions)
      onSave(selectedSkills);
      onClose(); // Close the dialog after saving
    } catch (error) {
      console.error("Error updating freelancer's skills: ", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <PersonIcon />
          </Avatar>
          {freelancer.firstName}'s Profile
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="body1"><strong>Email:</strong> {freelancer.email}</Typography>
          <Typography variant="body1"><strong>Experience:</strong> {freelancer.experience ? freelancer.experience + " years" : "0 years"}</Typography>

          {selectedSkills.length > 0 ? (
            <Box>
              <Typography variant="body1"><strong>Skills:</strong></Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {selectedSkills.map((skill, index) => (
                  <Chip key={index} label={skill} color="primary" />
                ))}
              </Stack>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">No skills added yet.</Typography>
          )}

          <Button variant="contained" onClick={handleOpenMenu}>
            {selectedSkills.length > 0 ? 'Add More Skills' : 'Add Skill'}
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
            {availableSkills.map((skill) => (
              <MenuItem key={skill} onClick={() => handleAddSkill(skill)}>
                {skill}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
