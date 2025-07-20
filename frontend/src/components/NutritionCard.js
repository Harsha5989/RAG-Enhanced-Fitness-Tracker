import React from "react";

export const NutritionCard = ({ title, image, description }) => (
  <div className="card">
    <img src={image} alt={title} />
    <div className="content">
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  </div>
);
