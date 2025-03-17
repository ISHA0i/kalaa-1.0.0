import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  HomeComponent,
  ProductComponent,
  AboutComponent,
  ContactComponent,
  SignInComponent,
  SignUpComponent,
  OrderComponent,
} from "./context/Page";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeComponent />} />
        <Route path="/App.js" element={<HomeComponent />} />
        <Route path="/Home" element={<HomeComponent />} />
        <Route path="/Product" element={<ProductComponent someProp="Value1" />} />
        <Route path="/Contact" element={<ContactComponent />} />
        <Route path="/About" element={<AboutComponent />} />
        <Route path="/SignIn" element={<SignInComponent />} /> {/* Ensure case matches */}
        <Route path="/SignUp" element={<SignUpComponent />} />
        <Route path="/Order" element={<OrderComponent />} />
      </Routes>
    </Router>
  );
};

export default App;
