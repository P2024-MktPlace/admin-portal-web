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
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import React, { useState, useEffect } from "react";
import BASE_API_URL from "../config";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import AddCategory from "./AddCategory";

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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch(`${BASE_API_URL}/suggested_products`);
        if (!response.ok) throw new Error("Network response was not ok");
        const result = await response.json();
        setOptions(
          result.map((item) => ({
            label: item.product_title,
            id: item.product_id,
          }))
        );
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
  };

  const handleUploadImages = async () => {
    if (files.length === 0) {
      console.error("No files selected");
      return;
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
      return result.url;
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error;
    }
  };

  const handleSubmitProduct = async () => {
    setLoading(true);

    try {
      const imageUrls = await handleUploadImages();
      setUploadedImageUrls(imageUrls);

      const productData = {
        product_image_list: imageUrls,
        suggested_products_list: selectedOptions
          .map((option) => option.id)
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
      setSnackbarOpen(true);

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
    } finally {
      setLoading(false);
    }
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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

  return (
    <Grid container spacing={3}>
      <Grid
        item
        xs={12}
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
          Add new product
        </Typography>
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
        {/* <Box className="b" p={2}>
          <Grid item xs={12}>
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
          <Box sx={{ mb: 2 }}>
            <input
              type="file"
              id="file-upload"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              {files.map((file, index) => (
                <Box key={index} sx={{ width: 80, height: 80 }}>
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

            <label htmlFor="file-upload">
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
                }}
              >
                <UploadIcon />
                <Typography variant="button">Choose Files</Typography>
              </IconButton>
            </label>
          </Box>
        </Box> */}
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
            <Box
              sx={{
                textAlign: "right", // Aligns the button to the right within the Box
              }}
            >
              <Button
                onClick={handleClickOpen}
                sx={{
                  padding: 0, // Removes default padding from the Button
                  textTransform: "none", // Keeps the text as is (no uppercase)
                  minWidth: "unset", // Removes the minimum width to match the Typography size
                }}
              >
                <Typography
                  sx={{
                    fontFamily:
                      "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    backgroundColor: "#74adf7", // Background color for the Typography
                    fontSize: "12px",
                    padding: "7px", // Adds padding inside the Typography for spacing
                    borderRadius: 1, // Adds border-radius for rounded corners
                    fontWeight: 500,
                    color: "black",
                    display: "inline-block", // Ensures the background color doesn't stretch across the entire Box
                  }}
                >
                  Add new Category
                </Typography>
              </Button>

              {/* Dialog for the AddCategory component */}
              <Dialog open={open} onClose={handleClose}>
                <AddCategory />
              </Dialog>
            </Box>
            <TextField
              id="category"
              label="Category"
              variant="outlined"
              fullWidth
              size="small"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              helperText="Select a category from the dropdown."
            />
          </Stack>
        </Box>
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
              // onChange={handleDescriptionChange}
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

          {/* <Box sx={{ mb: 2 }}>
            <TextField
              id="subCategory"
              label="Sub Category"
              variant="outlined"
              fullWidth
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
            />
          </Box> */}
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

          <Box sx={{ mb: 2 }}>
            <TextField
              id="price"
              label="Base Price"
              variant="outlined"
              fullWidth
              value={price}
              onChange={handlePriceChange}
              size="small"
              helperText="Set product price."
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
              helperText="Set product discount percentage. "
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
      </Grid>
      {/* <Grid item xs={12}>
        <Autocomplete
          multiple
          id="suggested-products"
          options={options}
          getOptionLabel={(option) => option.label}
          value={selectedOptions}
          onChange={handleChange}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Suggested Products"
              placeholder="Choose suggested products..."
            />
          )}
        />
      </Grid> */}
      {/* <Grid item xs={12} sx={{ textAlign: "right" }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 2 }}
          onClick={handleSubmitProduct}
        >
          Save Product
        </Button>
        <Button variant="outlined" color="secondary">
          Cancel
        </Button>
      </Grid> */}

      {/* <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop> */}
    </Grid>
  );
}

export default AddNewProduct;
