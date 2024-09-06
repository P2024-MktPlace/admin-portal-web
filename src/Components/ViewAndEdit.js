import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Stack,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import BASE_API_URL from "../config";

const categories = ["Electronics", "Apparel", "Home Appliances"];
const tags = ["New Arrival", "Best Seller", "Limited Edition", "Discounted"];

function ViewAndEdit({ open, onClose, productId }) {
  const [fields, setFields] = useState({
    title: "",
    price: "",
    category: "",
    discount: "",
    product_image_list: "",
    tags: [],
  });

  const [originalFields, setOriginalFields] = useState({ ...fields });
  const [editStates, setEditStates] = useState({
    title: false,
    price: false,
    category: false,
    discount: false,
    tags: false,
    product_image_list: false,
  });

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await axios.get(
          BASE_API_URL + `/product?id=${productId}`
        );

        const data = response.data;
        setFields({
          title: data.product_title,
          price: data.price,
          category: data.category,
          discount: data.discount,
          product_image_list: data.product_image_list,
          tags: data.tags || [], // Assuming tags are included in the API response
        });
        setOriginalFields({
          title: data.product_title,
          price: data.price,
          category: data.category,
          discount: data.discount,
          product_image_list: data.product_image_list,
          tags: data.tags || [], // Assuming tags are included in the API response
        });
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }

    if (open) {
      fetchProduct();
    }
  }, [open, productId]);

  const handleFieldChange = (field) => (event) => {
    setFields({ ...fields, [field]: event.target.value });
  };

  const handleTagsChange = (event, value) => {
    setFields({ ...fields, tags: value });
  };

  const handleCancelClick = (field) => {
    setFields({ ...fields, [field]: originalFields[field] });
    setEditStates({ ...editStates, [field]: false });
  };

  const handleEditClick = (field) => {
    if (editStates[field]) {
      // Call your API to update the value
      fetch(`{{url}}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          [field]: fields[field],
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          setOriginalFields({ ...originalFields, [field]: fields[field] });
          setEditStates({ ...editStates, [field]: false });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      setEditStates({ ...editStates, [field]: true });
    }
  };

  const renderTextField = (id, label, helperText) => (
    <TextField
      id={id}
      label={label}
      variant="outlined"
      fullWidth
      size="small"
      value={fields[id]}
      onChange={handleFieldChange(id)}
      helperText={helperText}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {editStates[id] ? (
              <>
                <IconButton
                  edge="end"
                  onClick={() => handleEditClick(id)}
                  color="primary"
                >
                  <SaveIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleCancelClick(id)}
                  color="default"
                >
                  <CancelIcon />
                </IconButton>
              </>
            ) : (
              <IconButton
                edge="end"
                onClick={() => handleEditClick(id)}
                color="default"
              >
                <EditIcon />
              </IconButton>
            )}
          </InputAdornment>
        ),
        readOnly: !editStates[id],
        disabled: !editStates[id],
      }}
    />
  );

  const renderSelectField = (id, label) => (
    <Box display="flex" alignItems="center">
      <FormControl fullWidth size="small" sx={{ flexGrow: 1 }}>
        <InputLabel>{label}</InputLabel>
        <Select
          id={id}
          value={fields[id]}
          label={label}
          onChange={handleFieldChange(id)}
          disabled={!editStates[id]}
        >
          {categories.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box ml={1} display="flex" alignItems="center">
        {editStates[id] ? (
          <>
            <IconButton
              edge="end"
              onClick={() => handleEditClick(id)}
              color="primary"
            >
              <SaveIcon />
            </IconButton>
            <IconButton
              edge="end"
              onClick={() => handleCancelClick(id)}
              color="default"
            >
              <CancelIcon />
            </IconButton>
          </>
        ) : (
          <IconButton
            edge="end"
            onClick={() => handleEditClick(id)}
            color="default"
          >
            <EditIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );

  const renderChipSelectField = (id, label) => {
    const handleChange = (event, value) => {
      handleTagsChange(event, value);
    };

    return (
      <Box display="flex" alignItems="center">
        <Autocomplete
          multiple
          id={id}
          options={tags}
          value={fields[id]}
          onChange={handleChange}
          disableCloseOnSelect
          getOptionLabel={(option) => option}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip label={option} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label={label} fullWidth />
          )}
          disabled={!editStates[id]}
          sx={{ flexGrow: 1 }}
        />
        <Box ml={1} display="flex" alignItems="center">
          {editStates[id] ? (
            <>
              <IconButton
                edge="end"
                onClick={() => handleEditClick(id)}
                color="primary"
              >
                <SaveIcon />
              </IconButton>
              <IconButton
                edge="end"
                onClick={() => handleCancelClick(id)}
                color="default"
              >
                <CancelIcon />
              </IconButton>
            </>
          ) : (
            <IconButton
              edge="end"
              onClick={() => handleEditClick(id)}
              color="default"
            >
              <EditIcon />
            </IconButton>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>View / Edit Product Details : {productId} </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Stack spacing={3}>
              <Box>
                <Grid item xs={12}>
                  <Typography
                    mb={1}
                    sx={{
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      fontSize: "20px",
                      textAlign: "left",
                      fontWeight: 500,
                    }}
                  >
                    Thumbnail
                  </Typography>
                  <Box
                    display="flex"
                    flexWrap="wrap"
                    justifyContent="center"
                    gap={1}
                  >
                    {fields.product_image_list
                      .split(",")
                      .map((image, index) => (
                        <Box key={index} width={70} height={70}>
                          <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "4px", // optional: for rounded corners
                            }}
                          />
                        </Box>
                      ))}
                  </Box>
                </Grid>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Stack spacing={2}>
              <Box sx={{ mb: 2 }} p={3}>
                <Grid item xs={12}>
                  <Typography
                    mb={1}
                    sx={{
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      fontSize: "20px",
                      textAlign: "left",
                      fontWeight: 500,
                    }}
                  >
                    Product Details
                  </Typography>
                </Grid>
                <Stack spacing={2} mt={2}>
                  {renderTextField(
                    "title",
                    "Product Name",
                    "A product name is required and recommended to be unique."
                  )}
                  {renderSelectField("category", "Category")}
                  {renderChipSelectField("tags", "Tags")}
                  {renderTextField(
                    "price",
                    "Base Price",
                    "Set product base price."
                  )}
                  {renderTextField(
                    "discount",
                    "Discount",
                    "Set product discount."
                  )}
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      {/* <DialogActions>
        <Button onClick={onClose} color="default">
          Close
        </Button>
      </DialogActions> */}
    </Dialog>
  );
}

export default ViewAndEdit;
