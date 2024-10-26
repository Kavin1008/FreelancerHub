"use client";

import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase"; 
import { getAuth } from "firebase/auth"; 
import {
  CircularProgress,
  Typography,
  Box,
  Card,
  CardContent,
  Grid2,
  Chip,
  Avatar,
  Button,
  Container,
  useTheme,
} from "@mui/material";
import { FileText, User, Calendar, DollarSign } from "lucide-react";
import { v4 as id } from "uuid";

const Proposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const clientId = localStorage.getItem("userUID"); 

          const q = query(
            collection(db, "proposals"),
            where("clientId", "==", clientId)
          );
          const querySnapshot = await getDocs(q);

          const proposalsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setProposals(proposalsData);
        } else {
          setError("User is not logged in.");
        }
      } catch (error) {
        console.error("Error fetching proposals: ", error);
        setError("Failed to fetch proposals.");
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);


const handleAccept = async (proposal) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setError("User is not logged in.");
      return;
    }

    const proposalsQuery = query(
      collection(db, "proposals"),
      where("id", "==", proposal.id)
    );

    const querySnapshot = await getDocs(proposalsQuery);

    if (!querySnapshot.empty) {
      const proposalDoc = querySnapshot.docs[0];
      const proposalRef = proposalDoc.ref;

      await updateDoc(proposalRef, {
        status: "Accepted",
        acceptedDate: new Date().toISOString(),
      });
      
      const projectQuery = query(
        collection(db, "projects"),
        where("id", "==", proposalRef.id)
      );
      console.log(proposal.clientId);
      
      const querySnapshot1 = await getDocs(projectQuery);

      if (!querySnapshot1.empty) {
        const projectDoc = querySnapshot1.docs[0].ref;
        await updateDoc(projectDoc, {
          status: "Accepted",
        });
        alert("Proposal accepted successfully.");
      } else {
        console.error("No project found with the given ID field.");
      }

      // Optionally, update local state to reflect the accepted status
      setProposals((prevProposals) =>
        prevProposals.map((p) =>
          p.id === proposal.id ? { ...p, status: "Accepted", acceptedDate: new Date().toISOString() } : p
        )
      );
    } else {
      console.error("Proposal not found.");
      setError("Proposal not found.");
    }
  } catch (error) {
    console.error("Error accepting proposal: ", error);
    setError("Failed to accept proposal.");
  }
};


  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: "bold" }}>
        Your Proposals
      </Typography>
      {proposals.length > 0 ? (
        <Grid2 container spacing={3}>
          {proposals.map((proposal) => (
            <Grid2 item xs={12} md={6} key={proposal.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                      <FileText />
                    </Avatar>
                    <Typography variant="h6" component="div">
                      Proposal #{proposal.id.slice(0, 8)}
                    </Typography>
                  </Box>
                  <Typography variant="body1" paragraph>
                    <strong>Description:</strong> {proposal.description}
                  </Typography>
                  <Box display="flex" alignItems="center" mb={1}>
                    <User size={20} style={{ marginRight: theme.spacing(1) }} />
                    <Typography variant="body2">
                      Freelancer Name: {proposal.freelancerName}
                    </Typography>
                  </Box>
                  {proposal.submissionDate && (
                    <Box display="flex" alignItems="center" mb={1}>
                      <Calendar
                        size={20}
                        style={{ marginRight: theme.spacing(1) }}
                      />
                      <Typography variant="body2">
                        Submitted on:{" "}
                        {new Date(proposal.submissionDate).toISOString}
                      </Typography>
                    </Box>
                  )}
                  {proposal.budget && (
                    <Box display="flex" alignItems="center" mb={2}>
                      <DollarSign
                        size={20}
                        style={{ marginRight: theme.spacing(1) }}
                      />
                      <Typography variant="body2">
                        Budget: ${proposal.budget}
                      </Typography>
                    </Box>
                  )}
                  {proposal.status && (
                    <Chip
                      label={proposal.status}
                      color={
                        proposal.status === "Accepted" ? "success" : "default"
                      }
                      size="small"
                    />
                  )}
                </CardContent>
                <Box p={2} pt={0}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => handleAccept(proposal)}
                    disabled={proposal.status === "Accepted"}
                  >
                    {proposal.status === "Accepted" ? "Accepted" : "Accept"}
                  </Button>
                </Box>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
          flexDirection="column"
        >
          <Typography variant="h6" gutterBottom>
            No proposals found.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Proposals;
