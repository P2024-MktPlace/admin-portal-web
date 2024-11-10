import { useState, useEffect, useMemo } from "react";
import { Box, Typography, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import BASE_API_URL from "../config";
import { debounce } from "lodash";

const PendingOrders = ({ onSelectOrder }) => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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
      }, 300),
    []
  );

  // Filtered rows based on the search query
  const filteredRows = useMemo(
    () =>
      orders.filter((order) =>
        order.order_id.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery, orders]
  );

  // Define the columns for the DataGrid
  const columns = [
    { field: "order_id", headerName: "Order ID", flex: 1 },
    { field: "order_status", headerName: "Order Status", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },
    {
      field: "created_at",
      headerName: "Created At",
      flex: 1,
    },
  ];

  return (
    <Box
      sx={{
        flex: "1 1 0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        sx={{
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          fontSize: "40px",
          fontWeight: 500,
          marginBottom: "20px",
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

      <div style={{ flexGrow: 1 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          pageSize={10}
          rowsPerPageOptions={[10]}
          autoHeight
          disableSelectionOnClick
          onRowClick={(params) => onSelectOrder(params.row)}
          getRowId={(row) => row.order_id} // Specify order_id as the unique ID for each row
          sx={{
            backgroundColor: "#fff",
            borderRadius: 2,
            boxShadow: 3,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f0f0f0",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
            },
            "& .MuiDataGrid-cell": {
              whiteSpace: "normal",
              wordWrap: "break-word",
              lineHeight: "1.2",
              display: "flex",
              alignItems: "center",
            },
          }}
          columnBuffer={5}
        />
      </div>
    </Box>
  );
};

export default PendingOrders;
