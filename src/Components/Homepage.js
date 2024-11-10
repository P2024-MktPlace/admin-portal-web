import React, { useState, useEffect } from "react";
import { Box, useMediaQuery, useTheme, Typography, Paper } from "@mui/material";
import { FaCheckCircle, FaSpinner, FaBoxOpen, FaTruck } from "react-icons/fa";
import BASE_API_URL from "../config";

function Homepage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const fetchOrderCount = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/getordercount`);
        const data = await res.json();
        setResponse(data); // set the response data to state
      } catch (error) {
        console.error("Error fetching order count:", error);
      }
    };

    fetchOrderCount();
  }, []);

  // Map the response data to statusData format
  const statusData = response
    ? [
        { key: "Total Orders", value: response.total_orders },
        { key: "Pending", value: response.pending_orders },
        { key: "In Progress", value: response.in_progress_orders },
        { key: "Completed (This Month)", value: response.completed_orders },
      ]
    : [];

  const getIcon = (key) => {
    switch (key) {
      case "Pending":
        return <FaSpinner style={{ fontSize: "24px", color: "#FF9800" }} />;
      case "In Progress":
        return <FaBoxOpen style={{ fontSize: "24px", color: "#FFC107" }} />;
      case "Completed (This Month)":
        return <FaCheckCircle style={{ fontSize: "24px", color: "#4CAF50" }} />;
      default:
        return <FaSpinner style={{ fontSize: "24px", color: "#2196F3" }} />;
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
          flex: "1 1 0",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <Box
          sx={{
            flex: "1 1 0",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            display: "flex",
            flexDirection: "column",
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
            Welcome, CHETHAN S!
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          {/* Four Vertical Boxes */}
          <Box
            sx={{ display: "flex", flexDirection: "column", padding: "16px" }}
          >
            {/* Container for Horizontal Boxes */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "16px",
                justifyContent: "space-between",
                flexWrap: "wrap",
                padding: "16px",
              }}
            >
              {statusData.map((status, index) => (
                <Paper
                  key={index}
                  elevation={3}
                  sx={{
                    width: "calc(33% - 16px)",
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
