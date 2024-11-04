import { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Divider,
  Stack,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import axios from "axios";
import BASE_API_URL from "../config";

import EventIcon from "@mui/icons-material/Event";
import OrderCard from "./OrderCard";

const OrderCardDetails = ({ item, onClick }) => {
  const [status, setStatus] = useState(item.order_status);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = async (event) => {
    const newStatus = event.target.value;

    const confirmChange = window.confirm(
      `Do you want to move the status from ${status} to ${newStatus}?`
    );

    if (!confirmChange) {
      return; // If the user clicks "No," exit the function
    }

    setStatus(newStatus);

    try {
      // Make a POST request to update the status
      axios.post(BASE_API_URL + "/updateorder", {
        key: "order_status",
        value: newStatus,
        id: item.order_id,
      });
      console.log("Status updated successfully");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <Card
      sx={{
        width: "100%", // Full width of the parent container
        boxShadow: 2,
      }}
      onClick={onClick}
    >
      <CardContent>
        <Stack>
          <Box display="flex" justifyContent="space-between">
            <Box
              display="flex" // Use flex display
              alignItems="center" // Vertically center the content
              justifyContent="flex-end" // Align content to the right
              sx={{
                width: "70%",
                textAlign: "left",
              }}
            >
              <span className="order_id">{item.order_id}</span>
            </Box>
            <Box
              display="flex"
              justifyContent="flex-end" // Align content to the right
              sx={{ width: "30%", textAlign: "right" }}
            >
              <span className="order_id">INR {item.amount} /-</span>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex", // Flexbox layout
              alignItems: "center", // Vertical alignment
              gap: 1, // Space between items
            }}
          >
            <EventIcon sx={{ color: "#808080" }} />
            <Typography
              variant="body2"
              color="text.secondary"
              className="order_created_date"
            >
              {item.longdate}
            </Typography>

            {/* Separator */}
            <Typography variant="body2" color="text.secondary">
              |
            </Typography>

            <FormControl
              sx={{
                fontSize: "12px",
                minWidth: 120,
                padding: 0,
                margin: 0,
              }}
              size="small"
            >
              <Select
                value={status}
                onChange={handleChange}
                sx={{
                  fontSize: "12px",
                  padding: 0,
                  margin: 0,
                }}
              >
                <MenuItem value="PENDING">PENDING</MenuItem>
                <MenuItem value="ACCEPTED">ACCEPTED</MenuItem>
                <MenuItem value="SHIPPED">SHIPPED</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box m={1}>
            <Divider />
            <Stack container direction="column" mt={2}>
              {item.ordproducts.map((item) => (
                <OrderCard item={item} />
              ))}
            </Stack>
          </Box>
        </Stack>
      </CardContent>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // Snackbar auto hides after 3 seconds
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Status updated successfully!
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default OrderCardDetails;
