import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
  ButtonBase,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import AdIcon from "@mui/icons-material/Campaign";
import AddNewProduct from "./AddNewProduct"; // Import your components
import PostaNewAd from "./PostaNewAd";
import ProductSearch from "./ProductSearch";
import Homepage from "./Homepage";

function DashBoard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedComponent, setSelectedComponent] = useState("Add New Product");
  const [open, setOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(open);
  };

  const handleMenuClick = (component) => {
    setSelectedComponent(component);
    if (isMobile) {
      setOpen(false); // Close drawer on mobile after selection
    }
  };

  const renderComponent = () => {
    switch (selectedComponent) {
      case "Dashboard":
        return <Homepage />;
      case "Product Catalog":
        return <AddNewProduct />;
      case "Inventory Management":
        return <ProductSearch />;
      case "Post an Advertisement":
        return <PostaNewAd />;
      default:
        return <Homepage />;
    }
  };

  const renderMenu = () => (
    <Box
      sx={{
        width: isMobile ? 250 : "100%", // Full width on desktop, smaller on mobile
        height: "100vh",
        padding: 2,
        boxSizing: "border-box",
      }}
    >
      {[
        { label: "Dashboard", icon: <AddIcon fontSize="small" /> },
        { label: "Product Catalog", icon: <SearchIcon fontSize="small" /> },
        { label: "Inventory Management", icon: <AddIcon fontSize="small" /> },
        { label: "Customer Profiles", icon: <SearchIcon fontSize="small" /> },
        { label: "Post an Advertisement", icon: <AdIcon fontSize="small" /> },
        { label: "Admin Users", icon: <AdIcon fontSize="small" /> },
        { label: "General Settings", icon: <AdIcon fontSize="small" /> },
      ].map((item) => (
        <ButtonBase
          key={item.label}
          sx={{
            width: "100%",
            textAlign: "left",
            borderRadius: 1,
            backgroundColor:
              selectedComponent === item.label ? "#d1e3ff" : "transparent",
            "&:hover": {
              backgroundColor: "#e0f7fa", // Light blue hover effect
            },
            marginBottom: 1,
            padding: 1,
          }}
          onClick={() => handleMenuClick(item.label)}
        >
          <Grid container alignItems="center">
            <Grid item>{item.icon}</Grid>
            <Grid item ml={1}>
              <Typography
                fontWeight={600}
                fontSize={12}
                className="heading_name"
                color={selectedComponent === item.label ? "black" : "inherit"}
              >
                {item.label}
              </Typography>
            </Grid>
          </Grid>
        </ButtonBase>
      ))}
    </Box>
  );

  return (
    <Grid container>
      {/* Left Column */}
      <Grid item xs={12} md={3} lg={2}>
        {isMobile ? (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
              {renderMenu()}
            </Drawer>
          </>
        ) : (
          renderMenu()
        )}
      </Grid>

      {/* Right Column */}
      <Grid item xs={12} md={9} lg={10}>
        <Box
          sx={{
            width: "100%",
            height: "100vh",
            overflowY: "auto",
            alignContent: "start",
            backgroundColor: "white",
            padding: 2,
            boxSizing: "border-box",
          }}
        >
          {renderComponent()}
        </Box>
      </Grid>
    </Grid>
  );
}

export default DashBoard;
