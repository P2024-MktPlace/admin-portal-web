import {
  Box,
  Grid,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  Stack,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import React, { useState } from "react";
import UploadIcon from "@mui/icons-material/Upload";
import BASE_API_URL from "../config";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

function PostaNewAd() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [files, setFiles] = useState([]);
  const [ad_title, setad_title] = useState("");
  const [start_date, setstart_date] = useState(dayjs());
  const [end_date, setend_date] = useState(dayjs());
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false); // New state for loading
  const today = dayjs(); // Use dayjs to get today's date

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
  };

  const validateFile = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const { width, height } = img;
        const aspectRatio = width / height;
        const requiredAspectRatio = 3;

        if (
          (width === 1200 && height === 400) ||
          aspectRatio === requiredAspectRatio
        ) {
          resolve(true);
        } else {
          reject(
            new Error(
              "Invalid image dimensions. Please upload an image with a 1200x400 px dimension or the same aspect ratio (3:1)."
            )
          );
        }
      };

      img.onerror = () => {
        reject(new Error("Invalid image file."));
      };
    });
  };

  const handleUpload = async () => {
    setLoading(true); // Start loading

    if (files.length === 0) {
      setError("No files selected");
      setSnackbarOpen(true);
      setLoading(false); // Stop loading
      return;
    }

    const formData = new FormData();
    try {
      for (const file of files) {
        await validateFile(file);
        formData.append("file", file);
      }

      const response = await fetch(`${BASE_API_URL}/upload_image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Network response was not ok");
      }

      const imageData = await response.json();

      // Now send the ad_title and date values along with the image data
      const adData = {
        ad_title,
        start_date: start_date.format("YYYY-MM-DD"), // Format date as needed
        end_date: end_date.format("YYYY-MM-DD"), // Format date as needed
        image_url: imageData.url, // Use the image URL from the response
        image_path: imageData.path,
      };

      const adResponse = await fetch(`${BASE_API_URL}/new_ads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adData),
      });

      if (!adResponse.ok) {
        const adErrorResponse = await adResponse.json();
        throw new Error(
          adErrorResponse.message || "Network response was not ok"
        );
      }

      const result = await adResponse.json();
      console.log("Ad created successfully:", result);

      setSnackbarOpen(true);
      setError("Ad created successfully"); // Use the snackbar to display success
    } catch (error) {
      setError(error.message);
      console.log(error.message);
      setSnackbarOpen(true);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div>
      <Grid container>
        <Grid item xs={12} className="bl bt br bb">
          <Box className="fw-bbx bb ">
            <span className="heading_name">Create a New Advertisement</span>
          </Box>
          <Box className="fw-bbx">
            <Box className="b" m={2}>
              <Box className="fw-bbx bb">
                <span className="heading_name">Upload Ad Image</span>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: "center",
                  gap: 2,
                  mb: 2,
                }}
              >
                {files.length > 0 &&
                  files.map((file, index) => (
                    <Box
                      m={2}
                      key={index}
                      sx={{
                        width: { xs: "100%", sm: 600 }, // 100% width on mobile, 600px on larger screens
                        height: { xs: "auto", sm: 75 }, // Auto height on mobile, 150px on larger screens
                        overflow: "hidden",
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
              <Box
                className="fw"
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: "center",
                  justifyContent: "center", // Horizontally centers the content
                  gap: 2,
                  mb: 2,
                }}
              >
                <input
                  type="file"
                  id="file-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <label htmlFor="file-upload">
                  <IconButton
                    color="primary"
                    component="span"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <UploadIcon />
                    <Typography variant="button">Choose Files</Typography>
                  </IconButton>
                </label>

                {/* Snackbar for error messages */}
                <Snackbar
                  open={snackbarOpen}
                  autoHideDuration={6000}
                  onClose={handleSnackbarClose}
                >
                  <Alert
                    onClose={handleSnackbarClose}
                    severity={
                      error === "Ad created successfully" ? "success" : "error"
                    }
                    sx={{ width: "100%" }}
                  >
                    {error}
                  </Alert>
                </Snackbar>
              </Box>

              <Box m={2}>
                <Typography variant="body2">
                  - Images with 1200 x 400 px or the same aspect ratio (3:1) are
                  only allowed.
                </Typography>
              </Box>
            </Box>
            <Box className="b" m={2}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      borderRight: !isMobile ? "1px solid #808080" : "none",
                      padding: 2,
                    }}
                  >
                    <Stack spacing={1}>
                      <TextField
                        id="ad_title"
                        label="Title of the Ad. "
                        size="small"
                        variant="outlined"
                        fullWidth
                        value={ad_title}
                        onChange={(e) => setad_title(e.target.value)}
                      />
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            label="Ad. Start Date"
                            minDate={today}
                            size="small"
                            value={start_date}
                            onChange={(newValue) => setstart_date(newValue)}
                            sx={{
                              width: "100%", // Adjust the width as needed
                            }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            label="Ad. End Date"
                            minDate={today}
                            value={end_date}
                            size="small"
                            onChange={(newValue) => setend_date(newValue)}
                            sx={{
                              width: "100%", // Adjust the width as needed
                            }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                      <Button variant="contained" onClick={handleUpload}>
                        Upload
                      </Button>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Loading Indicator */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default PostaNewAd;
