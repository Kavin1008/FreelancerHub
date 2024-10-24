import React from "react";
import { Container, Grid, Paper, Typography } from "@mui/material";

const items = [
  {
    firstName: "Jeeva",
    lastName: "Santhosh",
    mail: "gjeevasanthosh@gmail.com",
    skills: ["JavaScript", "React"],
  },
  {
    firstName: "John",
    lastName: "Doe",
    mail: "johndoe@example.com",
    skills: [], // No skills
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    mail: "janesmith@example.com",
    skills: ["Python", "Django"],
  },
  {
    firstName: "Jeeva",
    lastName: "Santhosh",
    mail: "gjeevasanthosh@gmail.com",
    skills: ["JavaScript", "React"],
  },
  {
    firstName: "John",
    lastName: "Doe",
    mail: "johndoe@example.com",
    skills: [], // No skills
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    mail: "janesmith@example.com",
    skills: ["Python", "Django"],
  },
  {
    firstName: "Jeeva",
    lastName: "Santhosh",
    mail: "gjeevasanthosh@gmail.com",
    skills: ["JavaScript", "React"],
  },
  {
    firstName: "John",
    lastName: "Doe",
    mail: "johndoe@example.com",
    skills: [], // No skills
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    mail: "janesmith@example.com",
    skills: ["Python", "Django"],
  },
  {
    firstName: "Jeeva",
    lastName: "Santhosh",
    mail: "gjeevasanthosh@gmail.com",
    skills: ["JavaScript", "React"],
  },
  {
    firstName: "John",
    lastName: "Doe",
    mail: "johndoe@example.com",
    skills: [], // No skills
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    mail: "janesmith@example.com",
    skills: ["Python", "Django"],
  },
  {
    firstName: "Jeeva",
    lastName: "Santhosh",
    mail: "gjeevasanthosh@gmail.com",
    skills: ["JavaScript", "React"],
  },
  {
    firstName: "John",
    lastName: "Doe",
    mail: "johndoe@example.com",
    skills: [], // No skills
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    mail: "janesmith@example.com",
    skills: ["Python", "Django"],
  },
  {
    firstName: "Jeeva",
    lastName: "Santhosh",
    mail: "gjeevasanthosh@gmail.com",
    skills: ["JavaScript", "React"],
  },
  {
    firstName: "John",
    lastName: "Doe",
    mail: "johndoe@example.com",
    skills: [], // No skills
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    mail: "janesmith@example.com",
    skills: ["Python", "Django"],
  },
  {
    firstName: "Jeeva",
    lastName: "Santhosh",
    mail: "gjeevasanthosh@gmail.com",
    skills: ["JavaScript", "React"],
  },
  {
    firstName: "John",
    lastName: "Doe",
    mail: "johndoe@example.com",
    skills: [], // No skills
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    mail: "janesmith@example.com",
    skills: ["Python", "Django"],
  },
  {
    firstName: "Jeeva",
    lastName: "Santhosh",
    mail: "gjeevasanthosh@gmail.com",
    skills: ["JavaScript", "React"],
  },
  {
    firstName: "John",
    lastName: "Doe",
    mail: "johndoe@example.com",
    skills: [], // No skills
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    mail: "janesmith@example.com",
    skills: ["Python", "Django"],
  },
  {
    firstName: "Jeeva",
    lastName: "Santhosh",
    mail: "gjeevasanthosh@gmail.com",
    skills: ["JavaScript", "React"],
  },
  {
    firstName: "John",
    lastName: "Doe",
    mail: "johndoe@example.com",
    skills: [], // No skills
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    mail: "janesmith@example.com",
    skills: ["Python", "Django"],
  },
  {
    firstName: "Jeeva",
    lastName: "Santhosh",
    mail: "gjeevasanthosh@gmail.com",
    skills: ["JavaScript", "React"],
  },
  {
    firstName: "John",
    lastName: "Doe",
    mail: "johndoe@example.com",
    skills: [], // No skills
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    mail: "janesmith@example.com",
    skills: ["Python", "Django"],
  },
  {
    firstName: "Jeeva",
    lastName: "Santhosh",
    mail: "gjeevasanthosh@gmail.com",
    skills: ["JavaScript", "React"],
  },
  {
    firstName: "John",
    lastName: "Doe",
    mail: "johndoe@example.com",
    skills: [], // No skills
  },
  {firstName: "Jane",
    lastName: "Smith",
    mail: "janesmith@example.com",
    skills: ["Python", "Django"],
  },
  {
    firstName: "Jeeva",
    lastName: "Santhosh",
    mail: "gjeevasanthosh@gmail.com",
    skills: ["JavaScript", "React"],
  },
  {
    firstName: "John",
    lastName: "Doe",
    mail: "johndoe@example.com",
    skills: [], // No skills
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    mail: "janesmith@example.com",
    skills: ["Python", "Django"],
  },
  // Add more items as needed
];

const HierFreelancer = () => {
  return (
      <Grid container spacing={2}>
        {items.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper elevation={3} style={{ padding: 16 }}>
              <Typography variant="h6">
                {item.firstName} {item.lastName}
              </Typography>
              <Typography variant="body1">{item.mail}</Typography>

              {item.skills.length > 0 && ( 
                <>
                  <Typography variant="body2">
                    {item.skills.join(", ")}
                  </Typography>
                </>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
  );
};

export default HierFreelancer;