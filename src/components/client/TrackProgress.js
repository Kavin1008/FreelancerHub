"use client"

import React, { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase' // Ensure this points to your Firebase config
import {
  CircularProgress, Typography, Box, Card, CardContent, Grid, Container,
  TextField, MenuItem, Select, FormControl, InputLabel, AppBar, Toolbar,
  IconButton, Tooltip
} from '@mui/material'
import {
  Search as SearchIcon,
  Sort as SortIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  DateRange as DateRangeIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material'

const ProgressList = () => {
  const [progressDocs, setProgressDocs] = useState([])
  const [filteredDocs, setFilteredDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('acceptedDate')

  useEffect(() => {
    const fetchProgressDocs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "progress"))
        const docsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setProgressDocs(docsData)
        setFilteredDocs(docsData)
      } catch (error) {
        console.error("Error fetching progress documents: ", error)
        setError("Failed to fetch progress documents.")
      } finally {
        setLoading(false)
      }
    }

    fetchProgressDocs()
  }, [])

  useEffect(() => {
    const filtered = progressDocs.filter(doc =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.freelancerName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    const sorted = filtered.sort((a, b) => {
      if (sortBy === 'acceptedDate') {
        return new Date(b.acceptedDate) - new Date(a.acceptedDate)
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title)
      } else if (sortBy === 'freelancerName') {
        return a.freelancerName.localeCompare(b.freelancerName)
      }
      return 0
    })
    setFilteredDocs(sorted)
  }, [progressDocs, searchTerm, sortBy])

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress />
    </Box>
  )

  if (error) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Typography color="error" variant="h6">{error}</Typography>
    </Box>
  )

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Toolbar>
          <AssignmentIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Progress List
          </Typography>
          <Typography variant="body2" color="inherit" sx={{ mr: 2 }}>
            Total Documents: {filteredDocs.length}
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
            }}
          />
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="sort-select-label">Sort By</InputLabel>
            <Select
              labelId="sort-select-label"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
            >
              <MenuItem value="acceptedDate">Date</MenuItem>
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="freelancerName">Freelancer</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        {filteredDocs.length > 0 ? (
          <Grid container spacing={3}>
            {filteredDocs.map((doc) => (
              <Grid item xs={12} md={6} key={doc.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <Tooltip title="Title">
                        <AssignmentIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                      </Tooltip>
                      {doc.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      <Tooltip title="Proposal ID">
                        <span>ID: {doc.proposalId}</span>
                      </Tooltip>
                    </Typography>
                    <Typography variant="body1" paragraph>
                      <Tooltip title="Freelancer">
                        <PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                      </Tooltip>
                      {doc.freelancerName}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      <Tooltip title="Status">
                        <CheckCircleIcon sx={{ verticalAlign: 'middle', mr: 1, color: doc.status === 'Completed' ? 'success.main' : 'info.main' }} />
                      </Tooltip>
                      {doc.status}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <Tooltip title="Accepted Date">
                        <DateRangeIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                      </Tooltip>
                      {new Date(doc.acceptedDate).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            minHeight="50vh"
            flexDirection="column"
          >
            <Typography variant="h6" gutterBottom>No progress documents found.</Typography>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default ProgressList