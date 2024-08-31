import { Box, Grid, Stack, Typography } from "@mui/material";

function AddCategory() {
  return (
  <Box 
  className="b"
  sx={{
    m: 2,
    p: 2,
    width: "30vw",
    height: "30vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "top",
  }}>
    <Stack >
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
              Add new Category
            </Typography>
          </Grid>
    </Stack>
  </Box>);
}

export default AddCategory;
