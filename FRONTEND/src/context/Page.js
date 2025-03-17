import React from 'react';
import '../styles/Page.css';
import Controls from './Controls';

import SignIn from '../components/SignIn'; // Import SignIn component
import SignUp from '../components/SignUp'; // Correctly import SignUp component
import Order from '../components/Order'; // Import Order component

import Product from '../components/Product';
import Contact from '../components/ContactPage';
import Home from '../components/Home';
import About from '../components/AboutPage';

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

const HomePage = () => {
  return (
    <div className="Home_page_container">
      <Home />
      <Product />
    </div>
  );
};

const ProductPage = () => {
  return (
    <div className="Product_page_container">
      <Product />
    </div>
  );
};
const ContactPage = () => {
  return (
    <div className="Contact_page_container">
      <Contact />
    </div>
  );
};
const AboutPage = () => {
  return (
    <div className="About_page_container">
      <About />
    </div>
  );
};

// Export components wrapped with Controls HOC
export const SignInComponent = Controls(SignInPage); // Sign-In page wrapped with Controls
export const SignUpComponent = Controls(SignUpPage); // Sign-Up page wrapped with Controls
export const OrderComponent = Controls(OrderPage); // Order page wrapped with Controls

export const AboutComponent = Controls(AboutPage);
export const HomeComponent = Controls(HomePage);
export const ProductComponent = Controls(ProductPage);
export const ContactComponent = Controls(ContactPage);
