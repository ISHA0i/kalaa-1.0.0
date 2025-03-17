import React from "react";
import "../styles/PagePersonal.css";
import Controls from "./Controls";

import SignIn from "./SignIn"; // Import SignIn component
import SignUp from "./SignUp"; // Correctly import SignUp component
import Order from "./Order"; // Import Order component

// Sign-In Page Component
const SignInPage = () => {
  return (
    <div className="SignIn_page_container">
      <SignIn />
    </div>
  );
};

// Sign-Up Page Component
const SignUpPage = () => {
  return (
    <div className="SignUp_page_container">
      <SignUp />
    </div>
  );
};

// Order Page Component
const OrderPage = () => {
  return (
    <div className="Order_page_container">
      <Order />
    </div>
  );
};

// Export components wrapped with Controls HOC
export const Account = Controls(SignInPage); // Sign-In page wrapped with Controls
export const SignUpComponent = Controls(SignUpPage); // Sign-Up page wrapped with Controls
export const OrderComponent = Controls(OrderPage); // Order page wrapped with Controls

// Export the original components if needed elsewhere
export { SignIn, SignUp, Order };
