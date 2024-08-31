import React, { useState } from "react";
import { Box, Grid, Stack, Typography, TextField, Button } from "@mui/material";
import { useDropzone } from "react-dropzone";

function AddCategory({ onClose }) {
  const [categoryName, setCategoryName] = useState("");
  const [files, setFiles] = useState([]);

  const handleCancel = () => {
    setCategoryName("");
    setFiles([]);
    onClose(); // Close the modal
  };

  const onDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false, // Restrict to one image
  });

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log("Category Name:", categoryName);
    console.log("Uploaded File:", files);
  };

  return (
    <Box
      sx={{
        m: 1,
        p: 2,
        width: "30vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Stack spacing={2}>
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

        <Grid item xs={12}>
          <TextField
            label="Category Name"
            variant="outlined"
            fullWidth
            size="small"
            value={categoryName}
            helperText="Dupliate categroy is not allowed."
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <Box
            {...getRootProps()}
            sx={{
              border: "2px dashed #90caf9",
              borderRadius: 2,
              padding: 2,
              textAlign: "center",
              backgroundColor: isDragActive ? "#e3f2fd" : "#fafafa",
              cursor: "pointer",
              height: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <input {...getInputProps()} />
            <Typography
              variant="body2"
              sx={{ color: isDragActive ? "#1976d2" : "#000" }}
            >
              {isDragActive
                ? "Drop the image here ..."
                : "Drag & drop an image here, or click to select an image"}
            </Typography>
          </Box>

          {files.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <img
                src={URL.createObjectURL(files[0])}
                alt="preview"
                style={{
                  width: "70px",
                  height: "auto",
                  borderRadius: 4,
                }}
              />
            </Box>
          )}
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined" color="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Grid>
      </Stack>
    </Box>
  );
}

export default AddCategory;
