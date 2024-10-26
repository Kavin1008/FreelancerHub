import React, { useState, useMemo } from "react";
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
import { Menu as MenuIcon, DollarSign, ClipboardList } from "lucide-react";
import TrackPaymentStatus from "./TrackPaymentStatus";
import ManageTasks from "./ManageTasks";
import ViewProjects from "./ViewProjects";
import { useNavigate } from "react-router-dom"; 

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
  { text: "View Projects", icon: <DollarSign size={20} /> },
  { text: "Manage Tasks", icon: <ClipboardList size={20} /> },
  { text: "Payment Status", icon: <ClipboardList size={20} /> },
  { text: "LogOut"}
];

const defaultActiveItem = menuItems[0].text;

export default function Navbar() {
  const [activeItem, setActiveItem] = useState(defaultActiveItem);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleNavMenuToggle = (event) => {
    setAnchorElNav((prev) => (prev ? null : event.currentTarget));
  };

  const handleItemClick = (item) => {
    if (item === "LogOut") {
      
      navigate("/login"); 
    } else {
      setActiveItem(item);
    }
    setAnchorElNav(null);
  };


  const renderActiveComponent = useMemo(() => {
    const componentsMap = {
      "View Projects": <ViewProjects />,
      "Manage Tasks": <ManageTasks />,
      "Payment Status": <TrackPaymentStatus />,
    };
    return componentsMap[activeItem] || null;
  }, [activeItem]);

  const MenuItems = ({ isMobile }) => (
    <>
      {menuItems.map(({ text, icon }) => (
        <StyledButton
          key={text}
          onClick={() => handleItemClick(text)}
          startIcon={icon}
          variant={activeItem === text ? "contained" : "text"}
          sx={{
            backgroundColor:
              activeItem === text ? "rgba(255, 255, 255, 0.2)" : "transparent",
          }}
        >
          {text}
        </StyledButton>
      ))}
    </>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <StyledAppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {isMobile ? (
              <>
                <IconButton
                  size="large"
                  aria-label="open menu"
                  onClick={handleNavMenuToggle}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorElNav}
                  open={Boolean(anchorElNav)}
                  onClose={handleNavMenuToggle}
                >
                  {menuItems.map(({ text }) => (
                    <MenuItem key={text} onClick={() => handleItemClick(text)}>
                      <Typography textAlign="center">{text}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                <MenuItems />
              </Box>
            )}
          </Toolbar>
        </Container>
      </StyledAppBar>
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {renderActiveComponent}
      </Container>
    </Box>
  );
}
