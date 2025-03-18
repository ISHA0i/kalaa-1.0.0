import React, from "react";{ useState } from "react";

export default function ProductPage() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const products = [
    { id: 1, name: "Product 1", description: "Short product description.", img: "https://via.placeholder.com/150" },
    { id: 2, name: "Product 2", description: "Short product description.", img: "https://via.placeholder.com/150" },
    { id: 3, name: "Product 3", description: "Short product description.", img: "https://via.placeholder.com/150" }
  ];

  const handleBuyNow = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="p-6">
      {/* Product List */}
      <div className="grid grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg shadow-md">
            <img src={product.img} alt={product.name} className="w-full h-40 object-cover rounded-md" />
            <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <button
              onClick={() => handleBuyNow(product)}
              className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>

      {/* Product Detail Section */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold">{selectedProduct.name}</h2>
            <img src={selectedProduct.img} alt={selectedProduct.name} className="w-full h-40 object-cover mt-2 rounded-md" />
            <p className="text-gray-700 mt-2">{selectedProduct.description}</p>
            <button
              onClick={() => setSelectedProduct(null)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductPage;
