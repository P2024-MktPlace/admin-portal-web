import {
  Alert,
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import BASE_API_URL from "../config";
import { useState } from "react";
import EventIcon from "@mui/icons-material/Event";
import { xcss } from "@atlaskit/primitives";
import Textfield from "@atlaskit/textfield";
import InlineEdit, { InlineEditableTextfield } from "@atlaskit/inline-edit";
import OrderCard from "./OrderCard";
import { useTheme } from "@mui/material/styles";
import "./../index.css";

import Form, {
  Field,
  FormFooter,
  FormHeader,
  FormSection,
  Label,
  RequiredAsterisk,
} from "@atlaskit/form";

import PendingIcon from "@mui/icons-material/HourglassEmpty";
import CancelIcon from "@mui/icons-material/Cancel";
import RefundIcon from "@mui/icons-material/Replay";
import ProcessIcon from "@mui/icons-material/Autorenew";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const readViewContainerStyles = xcss({
  font: "font.body",
  paddingBlock: "space.100",
  paddingInline: "space.075",
  wordBreak: "break-word",
  width: "100%",
});

function OrderDetails({ item }) {
  const bgcolor = "#f5f5f5";
  const [status, setStatus] = useState(item.order_status);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [sellerAddress, setSellerAddress] = useState(
    "Chethan S, ABC Shop, Kanadal Road, Kote, Chikkamagaluru, Karnataka 577101"
  );
  const [address, setAddress] = useState(
    "Chethan S, Ajjegowda Compound, Kanadal Road, Kote, Chikkamagaluru, Karnataka 577101"
  );
  const [deliveryPartner, setDeliveryPartner] = useState("Indian Speed Post");
  const [trackingId, setTrackingId] = useState("52525252");
  const [expectedDeliveryDate, setExpectedDeliveryDate] =
    useState("25-05-2024");

  const paymentData = [
    {
      paymentId: "P12345",
      orderId: "O12345",
      invoiceId: "I12345",
      method: "Credit Card",
      amount: "₹1000",
      fee: "₹50",
      tax: "₹18",
      date: "2024-11-10",
    },
    // You can add more rows as needed
  ];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const getStatusOptions = () => {
    switch (status) {
      case "PENDING":
        return [
          <MenuItem value="PENDING" key="PENDING">
            <PendingIcon fontSize="10" sx={{ mr: 1 }} />
            PENDING
          </MenuItem>,
          <MenuItem value="REJECT_ORDER" key="REJECT_ORDER">
            <CancelIcon fontSize="12px" sx={{ mr: 1 }} />
            REJECT ORDER
          </MenuItem>,
          <MenuItem value="REJECT_REFUND" key="REJECT_REFUND">
            <RefundIcon fontSize="12px" sx={{ mr: 1 }} />
            REJECT & REFUND
          </MenuItem>,
          <MenuItem value="PROCESSING" key="PROCESSING">
            <ProcessIcon fontSize="12px" sx={{ mr: 1 }} />
            PROCESSING
          </MenuItem>,
        ];
      case "PROCESSING":
        return [
          <MenuItem value="PROCESSING" key="PROCESSING">
            <ProcessIcon fontSize="12px" sx={{ mr: 1 }} />
            PROCESSING
          </MenuItem>,
          <MenuItem value="SHIPPING" key="SHIPPING">
            <LocalShippingIcon fontSize="12px" sx={{ mr: 1 }} />
            SHIPPING
          </MenuItem>,
        ];
      case "SHIPPING":
        return [
          <MenuItem value="SHIPPING" key="SHIPPING">
            <LocalShippingIcon fontSize="12px" sx={{ mr: 1 }} />
            SHIPPING
          </MenuItem>,
          <MenuItem value="ORDER_COMPLETED" key="ORDER_COMPLETED">
            <CheckCircleIcon fontSize="12px" sx={{ mr: 1 }} />
            ORDER COMPLETED
          </MenuItem>,
        ];
      case "ORDER_COMPLETED":
        return [
          <MenuItem value="ORDER_COMPLETED" key="ORDER_COMPLETED">
            <CheckCircleIcon fontSize="12px" sx={{ mr: 1 }} />
            ORDER COMPLETED
          </MenuItem>,
        ];
      default:
        return [
          <MenuItem value="PENDING" key="PENDING">
            PENDING
          </MenuItem>,
        ];
    }
  };

  const handleSellerAddressChange = async (newAddress) => {
    setSellerAddress(newAddress);
    try {
      await axios.post(BASE_API_URL + "/updateselleraddress", {
        value: newAddress,
      });
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleAddressChange = async (newAddress) => {
    setAddress(newAddress);
    try {
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleChange = async (event) => {
    const newStatus = event.target.value;
    const confirmChange = window.confirm(
      `Do you want to move the status from ${status} to ${newStatus}?`
    );
    if (!confirmChange) return;

    setStatus(newStatus);

    try {
      await axios.post(BASE_API_URL + "/updateorder", {
        key: "order_status",
        value: newStatus,
        id: item.order_id,
      });
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <Box spacking={1}>
      <Box>
        <Typography
          sx={{
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            fontSize: "40px",
            fontWeight: 500,
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
          className="headingname"
        >
          {item.order_id}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <EventIcon sx={{ color: "#808080" }} />
          <Typography
            variant="body2"
            color="text.secondary"
            className="order_created_date"
          >
            {item.longdate}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            |
          </Typography>
          <FormControl sx={{ m: 1, minWidth: 180 }} size="small">
            <Select
              value={status}
              onChange={handleChange}
              sx={{
                fontSize: "12px",
              }}
            >
              {getStatusOptions()}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Grid
        container
        direction={isMobile ? "column" : "row"}
        spacing={2}
        mt={1}
      >
        <Grid item xs={12} sm={7.8}>
          <Stack spacing={2}>
            <Grid container>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box
                    p={2}
                    sx={{
                      backgroundColor: bgcolor,
                      borderRadius: 1,
                      width: "100%",
                      textAlign: "left",
                    }}
                  >
                    <Typography fontWeight={600} fontSize={14}>
                      Address (Seller)
                    </Typography>
                    <InlineEditableTextfield
                      defaultValue={sellerAddress}
                      editButtonLabel={sellerAddress}
                      onConfirm={(value) => handleSellerAddressChange(value)}
                      placeholder={
                        sellerAddress === "" ? "Enter address" : sellerAddress
                      } // Placeholder for empty string
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box
                    p={2}
                    sx={{
                      backgroundColor: bgcolor,
                      borderRadius: 1,
                      width: "100%",
                      textAlign: "left",
                    }}
                  >
                    <Typography fontWeight={600} fontSize={14}>
                      Address (Buyer)
                    </Typography>
                    <InlineEditableTextfield
                      defaultValue={address}
                      editButtonLabel={address}
                      onConfirm={(value) => handleAddressChange(value)}
                      placeholder={address === "" ? "Enter address" : address} // Placeholder for empty string
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            <Box p={2} sx={{ backgroundColor: bgcolor, borderRadius: 1 }}>
              <Box
                sx={{
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Typography fontWeight={600} fontSize={14}>
                  Order Items
                </Typography>
              </Box>
              <Stack mt={1} mb={1} direction="column" spacing={2}>
                {item.ordproducts.map((product, index) => (
                  <OrderCard key={index} item={product} />
                ))}
              </Stack>
            </Box>

            <Box
              sx={{
                backgroundColor: bgcolor,
                borderRadius: 1,
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Payment ID</TableCell>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Invoice ID</TableCell>
                    <TableCell>Method of Payment</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Fee</TableCell>
                    <TableCell>Tax</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.paymentId}</TableCell>
                      <TableCell>{row.orderId}</TableCell>
                      <TableCell>{row.invoiceId}</TableCell>
                      <TableCell>{row.method}</TableCell>
                      <TableCell>{row.amount}</TableCell>
                      <TableCell>{row.fee}</TableCell>
                      <TableCell>{row.tax}</TableCell>
                      <TableCell>{row.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={4.2}>
          <Box sx={{ textAlign: "left", display: "flex" }}>
            <Stack spacing={2} sx={{ width: "100%" }}>
              <Box p={2} sx={{ backgroundColor: bgcolor, borderRadius: 1 }}>
                <Typography fontWeight={600} fontSize={14}>
                  Customer Details
                </Typography>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "#333", fontWeight: "medium" }}
                  >
                    CHETHAN S
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: "#555" }}>
                    cchethans14@gmail.com
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: "#555" }}>
                    +91 9844791372
                  </Typography>
                </Box>
              </Box>

              <Box
                p={2}
                sx={{
                  backgroundColor: bgcolor,
                  borderRadius: 2,
                  width: "100%",
                }}
              >
                <Typography fontWeight={600} fontSize={14}>
                  Delivery Details
                </Typography>

                <InlineEditableTextfield
                  defaultValue={deliveryPartner}
                  aria-required={true}
                  label="Delivery Partner"
                  editButtonLabel={deliveryPartner || setDeliveryPartner}
                  // onConfirm={(value) => handleChange(value)}
                  placeholder={
                    deliveryPartner === ""
                      ? "Enter Delivery Partner"
                      : deliveryPartner
                  } // Placeholder for empty string
                />

                <Box
                  sx={{
                    display: "block",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <InlineEditableTextfield
                    label="Delivery Tracking ID"
                    defaultValue={trackingId}
                    editButtonLabel={trackingId}
                    onConfirm={(value) => handleSellerAddressChange(value)}
                    placeholder={
                      trackingId === "" ? "Enter Tracking ID" : trackingId
                    } // Placeholder for empty string
                    size="small"
                  />
                  <InlineEditableTextfield
                    label="Expected Date of Delivery:"
                    defaultValue={expectedDeliveryDate}
                    editButtonLabel={expectedDeliveryDate}
                    onConfirm={(value) => handleSellerAddressChange(value)}
                    placeholder={
                      expectedDeliveryDate === ""
                        ? "Enter Date of Delivery"
                        : expectedDeliveryDate
                    } // Placeholder for empty string
                    sx={{ fontSize: "12px" }}
                  />
                </Box>
              </Box>
            </Stack>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default OrderDetails;
