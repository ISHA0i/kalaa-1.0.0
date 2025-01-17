import React from "react";
import "../styles/PagePersonal.css";
import Controls from './Controls';

import Account_page from "./Account";
import Signin_page from "./Signin";
import Order_page from "./Order";


 const AccountP = () => {
    return (
  
   
        <div className="Account_page_container">
          <Account_page />
        </div>

    );
  };
 const SignInP = () => {
    return (
  
        
        <div className="Signin_page_container">
          <Signin_page />
        </div>
    
    );
  };
 const OrderP = () => {
    return (
      
        <div className="Order_page_container">
          <Order_page />
        </div>
    );
  };
  
  export const Account = Controls(AccountP);
  export const SignIn = Controls(SignInP);
  export const Order = Controls(OrderP)
