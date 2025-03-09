import React from "react";
import Navbar_page from "./Navbar.js";
import About_page from "./About.js";
import Contact_page from "./Contact.js";
import Footer from "./Footer.js";

import "../styles/Controls.css";
const Controls = (WrappedComponent) => {
  return () => (
    <div>
      <div className="Navbar_page_container">
        <Navbar_page />
      </div>

      <div className="content">
        <WrappedComponent />
      </div>

      <div className="About_page_container">
        <About_page />
      </div>

      <div className="Contact_page_container">
        <Contact_page />
      </div>

      <div className="Footer_page_container">
        <Footer />
      </div>
    </div>
  );
};

export default Controls;
