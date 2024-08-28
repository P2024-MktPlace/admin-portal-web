import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { Grid, TextField, Box, Typography, Link } from "@mui/material";
import BASE_API_URL from "../config";
// import { useNavigate } from "react-router-dom";/

function ProductSearch() {
  const [rows, setRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  // const navigate = useNavigate();

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(BASE_API_URL + "/all_products");
        const data = response.data;

        if (data.length > 0) {
          // Generate columns based on keys from the first item in the data array
          const keys = Object.keys(data[0]);
          const generatedColumns = keys.map((key) => ({
            field: key,
            headerName:
              key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
            flex: key === "product_title" ? 0 : 1, // Adjust flex for specific column
            width: key === "product_title" ? 250 : "auto", // Set specific width for product_title
            renderCell: (params) => {
              // Special handling for "Available products" column
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

              // Special handling for image URLs
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

          // Add a custom column for redirection
          generatedColumns.push({
            field: "details",
            headerName: "Details",
            flex: 1,
            renderCell: (params) => (
              <Link
                href="#"
                // onClick={() => navigate(`/product/product_id:${params.row.id}`)}
                underline="none"
                style={{ cursor: "pointer", fontWeight: "bold" }}
              >
                View
              </Link>
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
            justifyContent: "flex-start", // Align content to the left
            alignItems: "flex-start", // Align content to the top
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
              size="small" // Make the TextField smaller in height
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
              backgroundColor: "#f0f0f0", // Background color of header
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold", // Make the header text bold
            },
            "& .MuiDataGrid-cell": {
              whiteSpace: "normal",
              wordWrap: "break-word",
              lineHeight: "1.2", // Adjust line height to make wrapped text look better
              display: "flex",
              alignItems: "center", // Vertical alignment to center
            },
          }}
          columnBuffer={5}
        />
      </div>
    </div>
  );
}

export default ProductSearch;
