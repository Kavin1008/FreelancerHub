import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
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
      const querySnapshot = await getDocs(collection(db, "projects"));
      const projectsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(projectsList);
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchFreelancerDetails = async () => {
      const userUID = localStorage.getItem("userUID");
      if (userUID) {
        const freelancerQuery = query(
          collection(db, "Freelancer"),
          where("id", "==", userUID)
        );

        const querySnapshot = await getDocs(freelancerQuery);

        if (!querySnapshot.empty) {
          const freelancerData = querySnapshot.docs[0].data();
          setFreelancerDetails(freelancerData);
          console.log(freelancerData);
        } else {
          console.log("No freelancer details found for this UID");
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
      try {
        // Create a new document under the "proposals" collection
        await addDoc(collection(db, "proposals"), {
          clientId: selectedProject.clientId, // Client ID from the selected project
          freelancerId: "yourFreelancerId", // Replace with the logged-in freelancer's ID
          description: selectedProject.newDescription, // Description entered in the popup
        });
        console.log("Proposal submitted successfully");
      } catch (error) {
        console.error("Error submitting proposal:", error);
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
