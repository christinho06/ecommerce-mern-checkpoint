import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantite, setQuantite] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <div className="container"><p className="muted">Chargement...</p></div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', gap: 32, marginTop: 24 }}>
        <img
          src={product.image_url || 'https://placehold.co/400x400?text=Produit'}
          alt={product.nom}
          style={{ width: 320, height: 320, objectFit: 'cover', borderRadius: 8 }}
        />
        <div>
          <h1>{product.nom}</h1>
          <p className="muted">{product.description}</p>
          <p className="product-card-price">{parseFloat(product.prix).toFixed(2)} €</p>
          <p className="muted">Stock disponible : {product.stock}</p>
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantite}
            onChange={(e) => setQuantite(Number(e.target.value))}
            style={{ width: 60, marginRight: 12 }}
          />
          <button
            className="btn btn-primary"
            onClick={() => { addToCart(product, quantite); setAdded(true); }}
          >
            Ajouter au panier
          </button>
          {added && <p className="muted">Ajouté au panier ✓</p>}
        </div>
      </div>
    </div>
  );
}
