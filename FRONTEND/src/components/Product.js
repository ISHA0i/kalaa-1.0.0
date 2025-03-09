import React from "react";
import '../styles/Product.css';
import decor from "../Assetes/images/decor.jpg";
import ciramic from "../Assetes/images/ciramic.jpeg";
import braslet from "../Assetes/images/braslet.jpg";


const Product = () => {
  
const products_Id = [
  {
    id: 1,
    title: "Product 1",
    description: "Short product description goes here.",
    imageUrl: ciramic,
  },
  {
    id: 2,
    title: "Product 2",
    description: "Short product description goes here.",
    imageUrl: braslet,
  },
  {
    id: 3,
    title: "Product 3",
    description: "Short product description goes here.",
    imageUrl: decor,
    
  },
  
];

  return (
    <div className="container1 ">
      <div className="row">
        {products_Id.map((product) => (
          <div className="col-md-4" key={product.id}>
            <div className="card" >
              <img
                src={product.imageUrl}
                className="card-photoo-top"
                alt="Product Image"
              />
              <div className="card-body">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text">{product.description}</p>
                <a href="/" className="btn btn-primary">
                  Buy Now
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
