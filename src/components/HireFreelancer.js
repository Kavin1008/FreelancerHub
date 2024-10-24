"use client"

import React, { useEffect, useState } from "react"
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Box,
  CircularProgress,
  Container,
  useTheme,
} from "@mui/material"
import { collection, getDocs } from "firebase/firestore"
import { db } from "./firebase"
import { User, Mail, Star } from "lucide-react"

const HireFreelancer = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const theme = useTheme()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Freelancer"))
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setData(items)
      } catch (error) {
        console.error("Error fetching data: ", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: "bold" }}>
        Available Freelancers
      </Typography>
      <Grid container spacing={3}>
        {data.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              elevation={3}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor: theme.palette.primary.main,
                      fontSize: "1.5rem",
                      mr: 2,
                    }}
                  >
                    {`${item.firstName.charAt(0)}${item.lastName.charAt(0)}`}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="div">
                      {item.firstName} {item.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                      <Mail size={16} style={{ marginRight: "4px" }} />
                      {item.email}
                    </Typography>
                  </Box>
                </Box>
                {Array.isArray(item.skills) && item.skills.length > 0 && (
                  <Box mt={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Skills:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {item.skills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          size="small"
                          sx={{
                            backgroundColor: theme.palette.primary.light,
                            color: theme.palette.primary.contrastText,
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
                <Box mt={2} display="flex" alignItems="center">
                  <Star size={16} style={{ color: theme.palette.warning.main, marginRight: "4px" }} />
                  <Typography variant="body2" color="text.secondary">
                    {item.rating || "Not rated yet"}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default HireFreelancer