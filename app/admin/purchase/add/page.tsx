"use client";
import React, { useState } from "react";

const AddPurchasePage: React.FC = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    quantity: "",
    price: "",
    supplier: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Purchase Data:", formData);
    // Add logic to handle form submission, e.g., API call
  };

  return (
    <div className="add-purchase-page">
      <h1>Add Purchase</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="itemName">Item Name:</label>
          <input
            type="text"
            id="itemName"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="supplier">Supplier:</label>
          <input
            type="text"
            id="supplier"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add Purchase</button>
      </form>
    </div>
  );
};

export default AddPurchasePage;
