import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, query, where, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid2,
  Chip,
  Box,
  Avatar,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Description,
  Domain,
  Person,
  CalendarToday,
} from "@mui/icons-material";
import ProjectPopup from "./ProjectPopup";
import PersonIcon from "@mui/icons-material/Person2";
import FreelancerPopup from "./FreelancerPopup";
import Navbar from "./FreelancerNavbar";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[4],
  },
}));

const StyledCardContent = styled(CardContent)({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
});

const InfoItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(1),
  "& > svg": {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
}));

export default function FreelancerJobs() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [desc, setDesc] = useState("");
  const [freelancerPopupOpen, setFreelancerPopupOpen] = useState(false);
  const [freelancerDetails, setFreelancerDetails] = useState({});

  
useEffect(() => {
  const fetchProjects = async () => {
    try {
      const q = query(collection(db, "projects"), where("status", "==", "Posted"));
      
      const querySnapshot = await getDocs(q);
      const projectsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setProjects(projectsList);
    } catch (error) {
      console.error("Error fetching projects: ", error);
    }
  };

  fetchProjects();
}, []);

  useEffect(() => {
    const fetchFreelancerDetails = async () => {
      const userUID = localStorage.getItem("userUID");
      if (userUID) {
        try {
          const freelancerQuery = query(
            collection(db, "Freelancer"),
            where("id", "==", userUID), // Fetch only projects with status "Posted"
          );
  
          const querySnapshot = await getDocs(freelancerQuery);
  
          if (!querySnapshot.empty) {
            const freelancerData = querySnapshot.docs[0].data();
            setFreelancerDetails(freelancerData);
          } else {
            console.log("No freelancer details found with status 'Posted' for this UID");
          }
        } catch (error) {
          console.error("Error fetching freelancer details:", error);
        }
      } else {
        console.error("No userUID found in localStorage");
      }
    };
  
    fetchFreelancerDetails();
  }, []);
  

  const onSave = (updatedSkills) => {
    // Update the state with the new skills
    setFreelancerDetails((prevDetails) => ({
      ...prevDetails,
      skills: updatedSkills,
    }));
    console.log("Updated skills saved:", updatedSkills);

    setPopupOpen(false);
  };

  const handleOpenPopup = (project) => {
    setSelectedProject({ ...project, newDescription: project.description });
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setSelectedProject(null);
  };

  const handleDescriptionChange = (newDescription) => {
    setDesc(newDescription);
  };

  const handleSave = async () => {
    if (selectedProject) {
      console.log(freelancerDetails);
      const userUID = localStorage.getItem("userUID");
      try {
        await addDoc(collection(db, "proposals"), {
          clientId: selectedProject.clientId, // Client ID from the selected project
          title: selectedProject.title,
          freelancerId: freelancerDetails.id, // Freelancer's ID
          freelancerName: freelancerDetails.firstName, // Freelancer's name
          description: desc, // Description entered in the popup
          submissionDate: new Date(), // Current date and time
          status: "Requested"
        });
        
        console.log("Proposal submitted successfully");
  
        // Update the status field of the selected project to "Requested"
        
        const projectRef = doc(db, "projects", selectedProject.id
      ); // Get the reference to the project document
      console.log(projectRef);
      
        await updateDoc(projectRef, {
          status: "Requested"
        });
  
        console.log("Project status updated to 'Requested'");
        
      } catch (error) {
        console.error("Error submitting proposal or updating project:", error);
      }
    }
  
    handleClosePopup(); // Close the popup after saving
  };
  

  const handleOpenFreelancerPopup = () => {
    setFreelancerPopupOpen(true);
  };

  const handleCloseFreelancerPopup = () => {
    setFreelancerPopupOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Navbar
        freelancerAvatar={
          freelancerDetails.avatarURL || freelancerDetails.name?.charAt(0)
        }
      />
      <Stack direction="row" justifyContent="space-between" width={"100%"}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ mb: 4, fontWeight: "bold" }}
        >
          All Projects
        </Typography>
        <Avatar onClick={handleOpenFreelancerPopup} sx={{ cursor: "pointer" }}>
          <PersonIcon />
        </Avatar>
      </Stack>
      <Grid2 container spacing={3}>
        {projects.map((project) => (
          <Grid2
            item
            xs={12}
            sm={6}
            md={4}
            lg={4}
            xl={4}
            key={project.id}
            onClick={() => handleOpenPopup(project)}
          >
            <StyledCard>
              <StyledCardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontWeight: "bold" }}
                  >
                    {project.title}
                  </Typography>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    {project.title.charAt(0)}
                  </Avatar>
                </Box>
                <InfoItem>
                  <Description fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    {project.description}
                  </Typography>
                </InfoItem>
                <InfoItem>
                  <Domain fontSize="small" />
                  <Chip label={project.domain} size="small" />
                </InfoItem>
                <InfoItem>
                  <CalendarToday fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    Posted on: {project.postedDate}
                  </Typography>
                </InfoItem>
              </StyledCardContent>
            </StyledCard>
          </Grid2>
        ))}
      </Grid2>

      {selectedProject && (
        <ProjectPopup
          open={popupOpen}
          onClose={handleClosePopup}
          project={selectedProject}
          handleDescriptionChange={handleDescriptionChange}
          handleSave={handleSave}
          description={desc}
        />
      )}

      <FreelancerPopup
        open={freelancerPopupOpen}
        onClose={handleCloseFreelancerPopup}
        freelancer={freelancerDetails}
        onSave={onSave}
      />
    </Container>
  );
}
