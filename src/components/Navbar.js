import React, { useState } from "react";
import { AppBar, Toolbar, Button } from "@mui/material";
import HierFreelancer from "./HireFreelancer";
import PostProjects from "./PostProjects";

const Navbar = () => {
  const items = [
    "Hier Freelancer",
    "Post Projects",
    "Track Progress",
    "Make Payment",
  ];

  const [activeItem, setActiveItem] = useState(items[0]);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  // Function to handle item click
  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  // Render the active component based on the active item
  const renderActiveComponent = () => {
    switch (activeItem) {
      case "Hier Freelancer":
        return <HierFreelancer />;

      case "Track Progress":
        return null;
      case "Make Payment":
        return null;
      default:
        return null;
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          {items.map((item) => (
            <Button
              key={item}
              color={activeItem === item ? "inherit" : "default"}
              onClick={() => {
                if (item === "Post Projects") {
                  handleClickOpen();
                } else {
                  handleItemClick(item);
                }
              }}
            >
              {item}
            </Button>
          ))}
        </Toolbar>
      </AppBar>
      <div style={{ padding: 16 }}>
        {renderActiveComponent()} {/* Render the active component here */}
      </div>
      <PostProjects setOpen={setOpen} open={open} />
    </div>
  );
};

export default Navbar;
