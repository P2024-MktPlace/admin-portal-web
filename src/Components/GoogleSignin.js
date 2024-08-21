import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

function GoogleSignIn() {
  const clientId =
    "381139703931-kere9buo07928gslci7fhqbb55egai4m.apps.googleusercontent.com"; // Replace with your Google Client ID

  const handleLoginSuccess = (response) => {
    console.log("Login Success:", response);
    // Handle the successful login here, like sending the token to your server
  };

  const handleLoginFailure = (response) => {
    console.error("Login Failed:", response);
    // Handle login failure
  };
  return (
    <div>
      <GoogleOAuthProvider clientId={clientId}>
        <div>
          <h1>Google Sign-In with React</h1>
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginFailure}
          />
        </div>
      </GoogleOAuthProvider>
    </div>
  );
}

export default GoogleSignIn;
