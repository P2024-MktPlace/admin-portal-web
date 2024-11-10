import { Box } from "@mui/material";

const OrderCard = ({ item }) => {
  console.log(item);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        width: "100%",
      }}
    >
      {/* Image Section - 30% */}
      <Box
        sx={{
          display: "flex",
          borderRadius: "5px",
          width: { xs: "100%", sm: "100px" }, // 100% on mobile, 30% on larger screens
          height: "100px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <img
          src={item.product_image_list.split(",")[0]}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* Circle with Quantity */}
        <Box
          sx={{
            position: "absolute",
            top: "5px",
            right: "5px",
            width: "25px",
            height: "25px",
            paddingBottom: "2px",
            borderRadius: "50%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
          }}
        >
          {item.product_quantity}
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" alignItems="flex-start" p={1}>
        <span className="order_prodid">Product ID: {item.product_id}</span>
        <span className="order_name">{item.product_name}</span>

        {/* <Box>
          <span className="order_name">Rs. {item.price} </span>
          <span className="order_discount"> -{item.discount}% </span>
        </Box> */}
        <span className="order_fprice">Rs. 1800.00</span>
      </Box>
    </Box>
  );
};

export default OrderCard;
