import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { Product, Contact, Home, About } from "./components/Page.js";
import { SignIn, SignUpComponent, OrderComponent} from "./components/PagePersonal.js"; // Correct imports

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/App.js" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Product" element={<Product someProp="Value1" />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/About" element={<About />} />
        <Route path="/SignIn" element={<SignIn />} /> {/* Ensure case matches */}
        <Route path="/SignUp" element={<SignUpComponent />} />
        <Route path="/Order" element={<OrderComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
