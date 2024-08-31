import {
  Box,
  Grid,
  Typography,
  IconButton,
  Stack,
  TextField,
  Button,
  Autocomplete,
  Snackbar,
  Alert,
  CircularProgress,
  Backdrop,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Dialog,
  Chip,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import React, { useState, useEffect } from "react";
import BASE_API_URL from "../config";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import AddCategory from "./AddCategory";
import { useDropzone } from "react-dropzone";
import axios from "axios"; // or use your preferred library for making HTTP requests

function AddNewProduct() {
  const [files, setFiles] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [finalPrice, setFinalPrice] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [availableProducts, setAvailableProducts] = useState(0);
  const [active, setActive] = useState(true);
  const [options, setOptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allProds, setAllProds] = useState([]);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/get_categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/all_products`);
        setAllProds(response.data);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchOptions();
  }, []);

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    if (value === "add_new") {
      handleClickOpen();
    } else {
      setCategory(value);
    }
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
  };

  const handleUploadImages = async () => {
    if (files.length === 0) {
      console.error("No files selected");
      return [];
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const response = await fetch(`${BASE_API_URL}/uploadimglist`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Network response was not ok");
      const result = await response.json();
      return result.url || [];
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error;
    }
  };

  const handleSubmitProduct = async () => {
    // Check if required fields are filled
    if (
      !title ||
      !description ||
      !category ||
      !price ||
      !availableProducts ||
      files.length === 0
    ) {
      setSnackbarMessage("Please fill in all required fields.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    try {
      const imageUrls = await handleUploadImages();
      setUploadedImageUrls(imageUrls);

      const productData = {
        product_image_list: imageUrls,
        suggested_products_list: selectedOptions
          .map((option) => option.product_id) // Adjust this field as needed
          .join(", "),
        category,
        sub_categories: subCategory,
        product_title: title,
        product_description: description,
        available_products: availableProducts,
        price: parseFloat(price),
        discount: parseFloat(discount),
        active,
      };

      const response = await fetch(`${BASE_API_URL}/add_new_product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error("Network response was not ok");
      const result = await response.json();
      console.log("Product added successfully:", result);

      setSnackbarMessage("New product added successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Reset state
      setFiles([]);
      setTitle("");
      setDescription("");
      setCategory("");
      setSubCategory("");
      setAvailableProducts(0);
      setPrice("");
      setDiscount("");
      setFinalPrice("");
      setSelectedOptions([]);
    } catch (error) {
      console.error("Error adding product:", error);
      setSnackbarMessage("Error adding product.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handlePriceChange = (event) => {
    const value = event.target.value;
    setPrice(value);
    calculateDiscount(value, discount);
  };

  const handleDiscountChange = (event) => {
    const value = event.target.value;
    setDiscount(value);
    calculateDiscount(price, value);
  };

  const calculateDiscount = (price, discount) => {
    if (price && discount) {
      const discountedPrice = price - (price * discount) / 100;
      setFinalPrice(discountedPrice.toFixed(2));
    } else {
      setFinalPrice("");
    }
  };

  const handleChange = (event, newValue) => {
    setSelectedOptions(newValue);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) =>
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]),
    accept: "image/*",
  });

  return (
    <Grid container spacing={3}>
      <Grid
        m={3}
        container
        sx={{
          alignItems: "center", // Vertically center align items
        }}
      >
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            alignItems: "bottom", // Center items vertically
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              fontSize: "40px",
              fontWeight: 500,
            }}
          >
            Add new product
          </Typography>
        </Grid>

        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            justifyContent: "flex-end", // Align buttons to the right
          }}
        >
          <Button variant="contained" onClick={handleSubmitProduct}>
            Submit
          </Button>
        </Grid>
      </Grid>

      <Grid
        item
        xs={12}
        sm={4}
        sx={{
          alignItems: "flex-start", // Align content to the top
          flexDirection: "column", // Stack elements vertically
          paddingLeft: "25px", // Add some padding for spacing
        }}
      >
        <Stack spacing={3}>
          <Box p={3} className="b">
            <Grid item xs={12} className="bb">
              <Typography
                mb={1}
                sx={{
                  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  fontSize: "20px",
                  textAlign: "left", // Ensures text is aligned to the left
                  fontWeight: 500,
                }}
              >
                Thumbnail
              </Typography>
            </Grid>

            <Box
              mt={2}
              {...getRootProps()}
              sx={{
                border: "2px dashed #90caf9",
                borderRadius: 2,
                padding: 2,
                textAlign: "center",
                backgroundColor: isDragActive ? "#e3f2fd" : "#fafafa",
                cursor: "pointer",
              }}
            >
              <input {...getInputProps()} />
              <Typography
                variant="body2"
                sx={{ color: isDragActive ? "#1976d2" : "#000" }}
              >
                {isDragActive
                  ? "Drop the files here ..."
                  : "Drag & drop some files here, or click to select files"}
              </Typography>
              <IconButton
                color="primary"
                component="span"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  backgroundColor: "#e3f2fd",
                  padding: 1,
                  borderRadius: 1,
                  mt: 1,
                }}
              >
                <UploadIcon />
                <Typography variant="button">Choose Files</Typography>
              </IconButton>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
              {files.map((file, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 1,
                    overflow: "hidden",
                    boxShadow: 3,
                  }}
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview ${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ mb: 2 }} className="b" p={3}>
            <Grid item xs={12} className="bb">
              <Typography
                mb={1}
                sx={{
                  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  fontSize: "20px",
                  textAlign: "left", // Ensures text is aligned to the left
                  fontWeight: 500,
                }}
              >
                Product Details
              </Typography>
            </Grid>

            <Stack spacing={2} mt={2}>
              <TextField
                labelId="category-label"
                id="category"
                select
                size="small"
                value={category}
                onChange={handleCategoryChange}
                label="Category"
                helperText="Select a category from the dropdown."
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.category}>
                    {cat.category}
                  </MenuItem>
                ))}
                <MenuItem value="add_new">Add new Category</MenuItem>
              </TextField>

              {/* Dialog for the AddCategory component */}
              <Dialog open={open} onClose={handleClose}>
                <AddCategory onClose={handleClose} />
              </Dialog>
            </Stack>
          </Box>
        </Stack>
      </Grid>

      <Grid item xs={12} sm={8}>
        <Stack spacing={2} className="b" p={3}>
          <Grid item xs={12} className="bb">
            <Typography
              mb={1}
              sx={{
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                fontSize: "20px",
                textAlign: "left", // Ensures text is aligned to the left
                fontWeight: 500,
              }}
            >
              General
            </Typography>
          </Grid>
          <Stack sx={{ mb: 2 }} spacing={2}>
            <TextField
              id="title"
              label="Product Name"
              variant="outlined"
              fullWidth
              size="small"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              helperText="A product name is required and recommended to be unique."
            />
            <ReactQuill
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Write your description here..."
              modules={{
                toolbar: [
                  ["bold", "italic"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  [{ align: [] }],
                ],
              }}
              formats={[
                "font",
                "list",
                "bullet",
                "bold",
                "italic",
                "underline",
                "strike",
                "color",
                "background",
                "link",
                "image",
                "align",
              ]}
            />
          </Stack>
          <Box sx={{ mb: 2 }}>
            <TextField
              id="availableProducts"
              label="Available Products"
              variant="outlined"
              fullWidth
              type="number"
              value={availableProducts}
              onChange={(e) => setAvailableProducts(e.target.value)}
              size="small"
              helperText="No of products available."
            />
          </Box>
          <Autocomplete
            multiple
            id="suggested_prods"
            options={allProds}
            getOptionLabel={(option) => option.product_title} // Adjust based on actual field names
            value={selectedOptions}
            size="small"
            onChange={handleChange}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Suggested Products"
                placeholder="Select products"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option) => (
                <Chip
                  label={option.product_title} // Ensure this matches the field from your API response
                  {...getTagProps({ index: value.indexOf(option) })} // Use index for key here
                  key={option.product_id} // Ensure this is unique
                />
              ))
            }
          />

          <Grid item xs={12} className="bb">
            <Typography
              mb={1}
              sx={{
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                fontSize: "20px",
                textAlign: "left", // Ensures text is aligned to the left
                fontWeight: 500,
              }}
            >
              Price details
            </Typography>
          </Grid>
          <Box sx={{ mb: 2 }}>
            <TextField
              id="price"
              label="Base Price"
              variant="outlined"
              fullWidth
              value={price}
              onChange={handlePriceChange}
              size="small"
              helperText="Set product base price."
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              id="discount"
              label="Discount (%)"
              variant="outlined"
              fullWidth
              value={discount}
              onChange={handleDiscountChange}
              size="small"
              helperText="Set product discount percentage if applicable. "
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              id="finalPrice"
              label="Final Price"
              variant="outlined"
              fullWidth
              value={finalPrice}
              disabled
            />
          </Box>
        </Stack>

        <div>
          {loading && <CircularProgress />}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbarSeverity}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </div>
      </Grid>
    </Grid>
  );
}

export default AddNewProduct;
