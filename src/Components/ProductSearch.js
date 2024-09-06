import React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { Grid, TextField, Box, Typography, Button } from "@mui/material";
import BASE_API_URL from "../config";
import ViewAndEdit from "./ViewAndEdit"; // Import the modal component

function ProductSearch() {
  const [rows, setRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedProductId, setSelectedProductId] = React.useState(null);
  const [selectedProductData, setSelectedProductData] = React.useState(null);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(BASE_API_URL + "/all_products");
        const data = response.data;

        if (data.length > 0) {
          const keys = Object.keys(data[0]);
          const generatedColumns = keys.map((key) => ({
            field: key,
            headerName:
              key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
            flex: key === "product_title" ? 0 : 1,
            width: key === "product_title" ? 250 : "auto",
            renderCell: (params) => {
              if (key === "available_products") {
                return (
                  <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
                    {params.value === 0 ? (
                      <span className="alert-red">NO STOCK</span>
                    ) : (
                      params.value
                    )}
                  </div>
                );
              }

              if (key === "product_image_list" && params.value) {
                return (
                  <div>
                    {params.value.split(",").map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Product ${index}`}
                        style={{
                          width: 60,
                          height: 60,
                          marginRight: 5,
                          borderRadius: 4,
                        }}
                      />
                    ))}
                  </div>
                );
              }

              return (
                <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
                  {params.value}
                </div>
              );
            },
          }));

          generatedColumns.push({
            field: "details",
            headerName: "Details",
            flex: 1,
            renderCell: (params) => (
              <Button
                onClick={() => {
                  setSelectedProductId(params.row.product_id); // Set the selected product ID
                  setSelectedProductData(params.row); // Set the selected product data
                  setModalOpen(true); // Open the modal
                }}
                style={{ cursor: "pointer", fontWeight: "bold" }}
              >
                View
              </Button>
            ),
          });

          setColumns(generatedColumns);
          setRows(data);
        }

        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProductId(null);
    setSelectedProductData(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box mb={3}>
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
          Inventory Management
        </Typography>
        <Grid container spacing={2} alignItems="center" mt={1}>
          <Grid item xs={8}>
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
              size="small"
            />
          </Grid>
          <Grid item xs={4}>
            <span align="right" className="sub-heading-regular">
              Total Products: {filteredRows.length}
            </span>
          </Grid>
        </Grid>
      </Box>
      <div style={{ flexGrow: 1 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          pageSize={10}
          rowsPerPageOptions={[10]}
          autoHeight
          disableSelectionOnClick
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
      {modalOpen && (
        <ViewAndEdit
          open={modalOpen}
          onClose={handleCloseModal}
          productId={selectedProductId}
          product={selectedProductData}
        />
      )}
    </div>
  );
}

export default ProductSearch;
