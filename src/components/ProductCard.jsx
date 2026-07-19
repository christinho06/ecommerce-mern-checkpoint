import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.image_url || 'https://placehold.co/300x300?text=Produit'}
          alt={product.nom}
        />
        <div className="product-card-body">
          <div>{product.nom}</div>
          <div className="product-card-price">{parseFloat(product.prix).toFixed(2)} €</div>
        </div>
      </Link>
    </div>
  );
}
