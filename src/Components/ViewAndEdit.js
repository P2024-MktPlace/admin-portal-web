import React, { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Stack,
  Alert,
  Button,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "axios";
import BASE_API_URL from "../config";

function ViewAndEdit({ open, onClose, productId }) {
  const [fields, setFields] = useState({
    product_title: "",
    product_price: "",
    product_image_list: "",
    product_description: "",
    oprice: "", // Added MRP price
    discount: "", // Added discount
    active: false, // Added active boolean
  });

  const [editingTitle, setEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState(false);
  const [tempDescription, setTempDescription] = useState("");

  const [editingOprice, setEditingOprice] = useState(false); // State for editing MRP price
  const [tempOprice, setTempOprice] = useState(""); // Temp state for MRP price

  const [editingDiscount, setEditingDiscount] = useState(false); // State for editing discount
  const [tempDiscount, setTempDiscount] = useState(""); // Temp state for discount

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false); // State for confirmation dialog

  useEffect(() => {
    if (open && productId) {
      fetchProduct();
    }
  }, [open, productId]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/get_product?id=${productId}`
      );
      const data = response.data;
      setFields({
        product_title: data.product_title,
        product_price: data.product_price,
        product_image_list: data.product_image_list,
        product_description: data.product_description,
        oprice: data.oprice || "", // Set initial MRP price
        discount: data.discount || "", // Set initial discount
        active: data.active, // Set initial active status
      });
      setTempDescription(data.product_description);
      setTempTitle(data.product_title); // Set the initial temp title
      setTempOprice(data.oprice || ""); // Set the initial temp MRP price
      setTempDiscount(data.discount || ""); // Set the initial temp discount
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const handleTitleEdit = () => {
    setEditingTitle(true);
    setTempTitle(fields.product_title);
  };

  const handleDescriptionEdit = () => {
    setEditingDescription(true);
    setTempDescription(fields.product_description);
  };

  const handleOpriceEdit = () => {
    setEditingOprice(true);
    setTempOprice(fields.oprice);
  };

  const handleDiscountEdit = () => {
    setEditingDiscount(true);
    setTempDiscount(fields.discount);
  };

  const handleToggleActive = () => {
    setConfirmDialogOpen(true);
  };

  const confirmToggleActive = async () => {
    const newActiveStatus = !fields.active;
    try {
      await axios.post(`${BASE_API_URL}/update`, {
        key: "active",
        value: newActiveStatus,
        id: productId,
      });
      setFields((prevFields) => ({ ...prevFields, active: newActiveStatus }));
    } catch (error) {
      console.error(`Error updating active status:`, error);
    } finally {
      setConfirmDialogOpen(false); // Close the confirmation dialog
    }
  };

  const handleSave = async (key, value) => {
    try {
      await axios.post(`${BASE_API_URL}/update`, {
        key: key,
        value: value,
        id: productId,
      });
      setFields((prevFields) => ({ ...prevFields, [key]: value }));
      if (key === "product_title") setEditingTitle(false);
      if (key === "product_description") setEditingDescription(false);
      if (key === "oprice") {
        setEditingOprice(false);
        setFields((prevFields) => ({ ...prevFields, oprice: value }));
      }
      if (key === "discount") {
        setEditingDiscount(false);
        setFields((prevFields) => ({ ...prevFields, discount: value }));
      }
    } catch (error) {
      console.error(`Error updating product ${key}:`, error);
    }
  };

  // Calculate the current price based on oprice and discount
  const calculateCurrentPrice = () => {
    const oprice = parseFloat(fields.oprice) || 0;
    const discount = parseFloat(fields.discount) || 0;
    const currentPrice = oprice - oprice * (discount / 100);
    return currentPrice.toFixed(2); // Return the current price rounded to two decimal places
  };

  // Update title dynamically based on price changes
  const updatedTitle = `${productId} - ${fields.product_title}`;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: fields.active ? "green" : "red", // Green for active, red for inactive
              marginRight: 8,
              cursor: "pointer",
            }}
            onClick={handleToggleActive}
          />
          {editingTitle ? (
            <TextField
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              autoFocus
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleSave("product_title", tempTitle)}
                      color="success"
                    >
                      <CheckIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => setEditingTitle(false)}
                      color="error"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          ) : (
            <Typography
              component="span"
              sx={{
                cursor: "pointer",
                transition: "background-color 0.3s",
                "&:hover": { backgroundColor: "#f4f5f7" },
              }}
              onClick={handleTitleEdit}
            >
              {updatedTitle}
            </Typography>
          )}
        </Typography>

        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2}>
          {/* Left Div for Product Images */}
          <Grid item xs={12} sm={4}>
            <Grid container spacing={2}>
              {fields.product_image_list.split(",").map((image, index) => (
                <Grid item xs={6} key={index}>
                  <Box
                    sx={{
                      width: 70, // Increased width
                      height: 70, // Increased height
                      borderRadius: 1,
                      overflow: "hidden",
                      border: "1px solid #ccc", // Optional: Add a border for better visibility
                    }}
                  >
                    <img
                      src={image}
                      alt={`Product Image ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Right Div for Product Details */}
          <Grid item xs={12} sm={8}>
            <Stack spacing={2}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Product Description
              </Typography>
              {editingDescription ? (
                <TextField
                  value={tempDescription}
                  onChange={(e) => setTempDescription(e.target.value)}
                  multiline
                  rows={2}
                  maxRows={4}
                  autoFocus
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            handleSave("product_description", tempDescription)
                          }
                          color="success"
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => setEditingDescription(false)}
                          color="error"
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              ) : (
                <Typography
                  component="span"
                  sx={{
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                    "&:hover": { backgroundColor: "#f4f5f7" },
                  }}
                  onClick={handleDescriptionEdit}
                >
                  {fields.product_description}
                </Typography>
              )}

              {/* MRP Price Section */}
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                MRP Price
              </Typography>
              {editingOprice ? (
                <TextField
                  value={tempOprice}
                  onChange={(e) => setTempOprice(e.target.value)}
                  autoFocus
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => handleSave("price", tempOprice)}
                          color="success"
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => setEditingOprice(false)}
                          color="error"
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              ) : (
                <Typography
                  component="span"
                  sx={{
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                    "&:hover": { backgroundColor: "#f4f5f7" },
                  }}
                  onClick={handleOpriceEdit}
                >
                  {fields.oprice}
                </Typography>
              )}

              {/* Discount Section */}
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Discount
              </Typography>
              {editingDiscount ? (
                <TextField
                  value={tempDiscount}
                  onChange={(e) => setTempDiscount(e.target.value)}
                  autoFocus
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => handleSave("discount", tempDiscount)}
                          color="success"
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => setEditingDiscount(false)}
                          color="error"
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              ) : (
                <Typography
                  component="span"
                  sx={{
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                    "&:hover": { backgroundColor: "#f4f5f7" },
                  }}
                  onClick={handleDiscountEdit}
                >
                  {fields.discount}
                </Typography>
              )}
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {fields.active ? "deactivate" : "activate"}{" "}
            this product?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmToggleActive} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}

export default ViewAndEdit;
