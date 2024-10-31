import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Stack,
  Grid,
} from "@mui/material";
import axios from "axios";
import BASE_API_URL from "../config";
import OrderProduct from "./OrderProduct";
import EventIcon from "@mui/icons-material/Event";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";

const OrderCardDetails = ({ item }) => {
  const [status, setStatus] = useState(item.status);

  const handleChange = async (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);

    try {
      // Make a POST request to update the status
      axios.post(BASE_API_URL + "/updateorder", {
        key: "order_status",
        value: newStatus,
        id: item.order_id,
      });
      console.log("Status updated successfully");
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
              <span className="order_id">Order #{item.order_id}</span>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              sx={{ width: "30%" }}
            >
              {/* Left Side - Amount */}
              <Box
                display="flex" // Flex display for alignment
                alignItems="center" // Vertically center content
                justifyContent="flex-end" // Align content to the right
                width="70%" // Set appropriate width
                sx={{
                  textAlign: "right",
                }}
              >
                <span className="order_id">INR {item.amount} /-</span>
              </Box>

              {/* Right Side - Fee and Tax */}
              <Box
                display="flex"
                flexDirection="column"
                width="30%" // Set width to fit appropriately
              >
                <Box display="flex" justifyContent="flex-end">
                  <span className="orderfeeTax">Fee: {item.fee}</span>
                  <span className="orderfeeTax">Tax: {item.tax}</span>
                </Box>
              </Box>
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
                value={item.order_status}
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

          <Box pt={1}>
            <Divider />

            {/* <Stack container direction="column">
              {item.ordproducts.map((item) => (
                <OrderProduct item={item} />
              ))}
            </Stack> */}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default OrderCardDetails;
