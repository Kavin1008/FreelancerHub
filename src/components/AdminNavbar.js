"use client";

import React, { useState } from "react";
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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Menu as MenuIcon,
  UserPlus,
  FileText,
  MessageSquare,
} from "lucide-react";
import AdminClient from "./AdminClient";
import AdminFreelancer from "./AdminFreelancer";
import AdminProjects from "./AdminProjects";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  margin: theme.spacing(0, 1),
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
}));

const menuItems = [
  { text: "Client", icon: <UserPlus size={20} /> },
  { text: "Freelancer", icon: <FileText size={20} /> },
  { text: "Projects", icon: <MessageSquare size={20} /> },
];

export default function Navbar() {
  const [activeItem, setActiveItem] = useState(menuItems[0].text);
  const [anchorElNav, setAnchorElNav] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleItemClick = (item) => {
    setActiveItem(item);
    setAnchorElNav(null);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const renderActiveComponent = () => {
    switch (activeItem) {
      case "Client":
        return <AdminClient />;
      case "Freelancer":
        return <AdminFreelancer />;
      case "Projects":
        return <AdminProjects />;
      default:
        return null;
    }
  };

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
                        handleItemClick(item.text);
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
                      handleItemClick(item.text);
                    }}
                    startIcon={item.icon}
                    variant={activeItem === item.text ? "contained" : "text"}
                    sx={{
                      backgroundColor:
                        activeItem === item.text
                          ? "rgba(255, 255, 255, 0.2)"
                          : "transparent",
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
    </Box>
  );
}
