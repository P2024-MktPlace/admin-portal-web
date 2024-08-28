import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import BASE_API_URL from "../config";

function GoogleSignIn({ onSuccess, onFailure }) {
  const clientId =
    "381139703931-jhr65g2itqnr2akkc1f4rgn0cbbn0jp7.apps.googleusercontent.com"; // Replace with your Google Client ID

  const handleLoginSuccess = async (credentialResponse) => {
    // console.log("Login Success:", credentialResponse);
    const jwtToken = credentialResponse.credential; // JWT token
    // console.log("JWT Token:", jwtToken);

    try {
      const response = await fetch(BASE_API_URL + "/verifyjtw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: jwtToken }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse the JSON response only once
      const responseData = await response.json();

      // Check if the response status is SUCCESS
      if (responseData.status === "SUCCESS") {
        onSuccess(); // Notify success
      } else {
        console.error("Operation failed:", responseData.message);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  const handleLoginFailure = (response) => {
    console.error("Login Failed:", response);
    onFailure(); // Notify failure
  };

  return (
    <div className="adminpanel">
      <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginFailure}
        />
      </GoogleOAuthProvider>
    </div>
  );
}

export default GoogleSignIn;
