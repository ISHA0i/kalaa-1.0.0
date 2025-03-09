import React from "react";
import "../styles/Page.css";
import Controls from "./Controls";
import Product_page from "./Product";
import Contact_page from "./ContactPage";
import Home_page from "./Home";
import About_page from "./AboutPage";

const HomeP = () => {
  return (
    <div className="Home_page_container">
      <Home_page />
      <Product_page />
    </div>
  );
};

const ProductP = () => {
  return (
    <div className="Product_page_container">
      <Product_page />
    </div>
  );
};
// if(WrappedComponent === Contact_page){
//   return (

//   );

// }
const ContactP = () => {
  return (
    <div className="Contact_page_container">
      <Contact_page />
    </div>
  );
};
const AboutP = () => {
  return (
    <div className="About_page_container">
      <About_page />
    </div>
  );
};

export const About = Controls(AboutP);
export const Home = Controls(HomeP);
export const Product = Controls(ProductP);
export const Contact = Controls(ContactP);
