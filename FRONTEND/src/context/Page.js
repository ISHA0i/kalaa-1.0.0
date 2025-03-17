import React from 'react';
import '../styles/Page.css';
import Controls from './Controls';

import SignIn from '../components/view/Account/SignIn'; // Import SignIn component
import SignUp from '../components/view/Account/SignUp'; // Correctly import SignUp component
import Cart from '../components/Cart'; // Import Order component
import Profile from '../components/view/Account/Profile';
import Product from '../components/Product';
import Contact from '../components/view/Pages/Contact';
import Home from '../components/Home';
import About from '../components/view/Pages/About';

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
const CartPage = () => {
  return (
    <div className="Order_page_container">
      <Cart />
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
const ProfilePage = () => {
  return (
    <div className="Profile_page_container">
      <Profile />
    </div>
  );
};
// Export components wrapped with Controls HOC
export const SignInComponent = Controls(SignInPage); // Sign-In page wrapped with Controls
export const SignUpComponent = Controls(SignUpPage); // Sign-Up page wrapped with Controls
export const CartComponent = Controls(CartPage); // Order page wrapped with Controls
export const ProfileComponent = Controls(ProfilePage);
export const AboutComponent = Controls(AboutPage);
export const HomeComponent = Controls(HomePage);
export const ProductComponent = Controls(ProductPage);
export const ContactComponent = Controls(ContactPage);
