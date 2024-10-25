"use client"

import React, { useState } from "react"
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { Menu as MenuIcon, UserPlus, FileText, MessageSquare, BarChart2, CreditCard } from "lucide-react"
import HireFreelancer from "../client/HireFreelancer"
import PostProjects from "../client/PostProjects"
import Proposals from "../client/Proposals"

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
}))

const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  margin: theme.spacing(0, 1),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}))

const menuItems = [
  { text: "Hire Freelancer", icon: <UserPlus size={20} /> },
  { text: "Post Projects", icon: <FileText size={20} /> },
  { text: "Proposals", icon: <MessageSquare size={20} /> },
  { text: "Track Progress", icon: <BarChart2 size={20} /> },
  { text: "Make Payment", icon: <CreditCard size={20} /> },
]

export default function Navbar() {
  const [activeItem, setActiveItem] = useState(menuItems[0].text)
  const [open, setOpen] = useState(false)
  const [anchorElNav, setAnchorElNav] = useState(null)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleItemClick = (item) => {
    setActiveItem(item)
    setAnchorElNav(null)
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const renderActiveComponent = () => {
    switch (activeItem) {
      case "Hire Freelancer":
        return <HireFreelancer />
      case "Proposals":
        return <Proposals />
      case "Track Progress":
        return <Typography>Track Progress Component</Typography>
      case "Make Payment":
        return <Typography>Make Payment Component</Typography>
      default:
        return null
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <StyledAppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>

            {isMobile ? (
              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {menuItems.map((item) => (
                    <MenuItem
                      key={item.text}
                      onClick={() => {
                        if (item.text === "Post Projects") {
                          handleClickOpen()
                        } else {
                          handleItemClick(item.text)
                        }
                      }}
                    >
                      <Typography textAlign="center">{item.text}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            ) : (
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {menuItems.map((item) => (
                  <StyledButton
                    key={item.text}
                    onClick={() => {
                      if (item.text === "Post Projects") {
                        handleClickOpen()
                      } else {
                        handleItemClick(item.text)
                      }
                    }}
                    startIcon={item.icon}
                    variant={activeItem === item.text ? "contained" : "text"}
                    sx={{
                      backgroundColor: activeItem === item.text ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    }}
                  >
                    {item.text}
                  </StyledButton>
                ))}
              </Box>
            )}
          </Toolbar>
        </Container>
      </StyledAppBar>
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {renderActiveComponent()}
      </Container>
      <PostProjects setOpen={setOpen} open={open} />
    </Box>
  )
}