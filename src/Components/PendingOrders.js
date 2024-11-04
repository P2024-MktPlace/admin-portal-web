import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Card,
  Button,
  Grid,
  Stack,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import BASE_API_URL from "../config";
import OrderCardDetails from "./OrderCardDetails";
import { debounce } from "lodash";

const PendingOrders = ({ onSelectOrder }) => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const ordersPerPage = 20;
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm")); // Responsive design

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/allorders`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  // Debounce the search input to avoid excessive re-renders
  const handleSearch = useMemo(
    () =>
      debounce((query) => {
        setSearchQuery(query);
        setCurrentPage(1); // Reset to the first page
      }, 300),
    []
  );

  // Filtered orders based on the search query
  const filteredOrders = useMemo(
    () =>
      orders.filter((order) =>
        order.order_id.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery, orders]
  );

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = useMemo(
    () => filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder),
    [filteredOrders, indexOfFirstOrder, indexOfLastOrder]
  );

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  }, [currentPage, totalPages]);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  }, [currentPage]);

  return (
    <Box
      sx={{
        flex: "1 1 0", // Flex-grow, flex-shrink, flex-basis
        justifyContent: "flex-start", // Align content to the left
        alignItems: "flex-start", // Align content to the top
        display: "flex",
        flexDirection: "column", // Stack elements vertically
      }}
    >
      <Typography
        sx={{
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          fontSize: "40px",
          fontWeight: 500,
          display: "block",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          display: "flex",
        }}
        className="headingname"
      >
        Orders
      </Typography>

      <TextField
        label="Search Orders"
        variant="outlined"
        fullWidth
        onChange={(e) => handleSearch(e.target.value)}
        sx={{ marginBottom: "20px" }}
      />

      <Grid container spacing={2} direction="column">
        {currentOrders.map((item) => (
          <Grid item key={item.order_id}>
            <OrderCardDetails item={item} onClick={() => onSelectOrder(item)} />
          </Grid>
        ))}
      </Grid>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ marginTop: "20px" }}
      >
        <Button
          variant="contained"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Typography>
          Page {currentPage} of {totalPages}
        </Typography>
        <Button
          variant="contained"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </Stack>
    </Box>
  );
};

export default PendingOrders;
