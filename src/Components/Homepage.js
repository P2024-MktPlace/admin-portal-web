import React from "react";
import { Box, useMediaQuery, useTheme, Typography, Paper } from "@mui/material";
import { FaCheckCircle, FaSpinner, FaBoxOpen, FaTruck } from "react-icons/fa"; // Import icons for demonstration

function Homepage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if the screen is small (mobile)

  const statusData = [
    { key: "New", value: 5 },
    { key: "Processing", value: 10 },
    { key: "Shipped", value: 20 },
  ];

  const getIcon = (key) => {
    switch (key) {
      case "New":
        return <FaSpinner style={{ fontSize: "24px", color: "#FF9800" }} />;
      case "Processing":
        return <FaBoxOpen style={{ fontSize: "24px", color: "#FFC107" }} />;
      case "Shipped":
        return <FaTruck style={{ fontSize: "24px", color: "#2196F3" }} />;
      case "Delivered":
        return <FaCheckCircle style={{ fontSize: "24px", color: "#4CAF50" }} />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        height: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Two Vertical Boxes under Main Box */}
      <Box
        sx={{
          flex: "1 1 0", // Split the remaining space evenly
          display: "flex",

          flexDirection: isMobile ? "column" : "row", // Stack vertically on mobile, row on larger screens
        }}
      >
        <Box
          sx={{
            flex: "1 1 0", // Flex-grow, flex-shrink, flex-basis
            justifyContent: "flex-start", // Align content to the left
            alignItems: "flex-start", // Align content to the top
            display: "flex",
            flexDirection: "column", // Stack elements vertically
            paddingLeft: "25px", // Add some padding for spacing
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              fontSize: "40px",
              fontWeight: 500,
              display: "block",
            }}
            className="headingname"
          >
            Dashboard
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              fontSize: "16px",
              fontWeight: 400,
              display: "block",
            }}
            className="sub-heading-regular"
          >
            Welcome, CHETHAN S !
          </Typography>
        </Box>
        <Box
          sx={{
            flex: 1,
          }}
        >
          {/* Four Vertical Boxes */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "16px",
            }}
          >
            {/* Main Box */}

            {/* Container for Horizontal Boxes */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "16px",
                justifyContent: "space-between", // Ensure items are evenly spaced
                flexWrap: "wrap",
                padding: "16px",
              }}
            >
              {statusData.map((status, index) => (
                <Paper
                  key={index}
                  elevation={3}
                  sx={{
                    width: "calc(33% - 16px)", // Adjust width to fit 4 items in a row with gaps
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "10px",
                    padding: "16px",
                    boxSizing: "border-box",
                    alignItems: "center",
                    textAlign: "center",
                    backgroundColor: "#F5EDED",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    {/* Icon based on status */}
                    <Box sx={{ marginBottom: "8px" }}>
                      {getIcon(status.key)}
                    </Box>
                    <Box>
                      <span className="ordercount">{status.value}</span>
                      <span className="orderdesc">{status.key}</span>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Homepage;
