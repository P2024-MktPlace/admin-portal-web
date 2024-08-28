import React, { useState } from "react";
import "./App.css";
import GoogleSignIn from "./Components/GoogleSignin";
import DashBoard from "./Components/Dashboard";
import { Box } from "@mui/material";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLoginFailure = () => {
    console.error("Login failed");
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <DashBoard />
      ) : (
        <Box
          sx={{
            backgroundImage: `url('https://storage.cloud.google.com/jewel_storage/public/background_banner.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100vh", // Full height of the viewport
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              height: "30%",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#e6e6e6",
            }}
          >
            <Box
              component="img"
              // src={logo}
              alt="Logo"
              sx={{
                height: "auto",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
            <GoogleSignIn
              onSuccess={handleLoginSuccess}
              onFailure={handleLoginFailure}
            />
          </Box>
        </Box>
      )}
    </div>
  );
}

export default App;
