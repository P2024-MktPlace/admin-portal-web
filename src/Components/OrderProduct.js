import { Box, Card, Stack, Typography } from "@mui/material";

const OrderProduct = (item) => {
  item = item.item;

  return (
    <Box mt={2} display="flex" width="100%">
      {/* 20% Section - Image */}
      <Box
        width="120px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <img
          src={item.product_image_list.split(",")[0]}
          alt="Placeholder"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain", // Ensures the image scales properly
          }}
        />
      </Box>

      <Box
        width="80%"
        p={2}
        display="flex"
        flexDirection="column"
        alignItems="flex-start" /* Ensures left alignment */
      >
        <Stack spacing={1}>
          <span className="product_name">{item.product_name}</span>
          <span className="product_info">SKU : {item.product_id}</span>
          <span className="product_info">Quantity : {item.product_id}</span>
        </Stack>
      </Box>
    </Box>
  );
};

export default OrderProduct;
