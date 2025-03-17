import React from "react";
import Navbarpage from "../components/Navbar.js";
import Footer from "../components/Footer.js";

import "../styles/Controls.css";

const Controls = (WrappedComponent) => {
  return () => {
    console.log("Controls HOC applied to:", WrappedComponent.name); // Debugging log
    return (
      <div>
        <div className="Navbar_page_container">
          <Navbarpage />
        </div>

        <div className="content">
          <WrappedComponent />
        </div>

        <div className="Footer_page_container">
          <Footer />
        </div>
      </div>
    );
  };
};

export default Controls;
