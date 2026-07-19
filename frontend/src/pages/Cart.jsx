import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { items, removeFromCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container">
        <h1>Panier</h1>
        <p className="muted">Ton panier est vide. <Link to="/">Voir les produits</Link></p>
      </div>
    );
  }

  function handleCheckout() {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  }

  return (
    <div className="container">
      <h1>Panier</h1>
      <table>
        <thead>
          <tr><th>Produit</th><th>Quantité</th><th>Prix</th><th></th></tr>
        </thead>
        <tbody>
          {items.map(({ product, quantite }) => (
            <tr key={product.id}>
              <td>{product.nom}</td>
              <td>{quantite}</td>
              <td>{(parseFloat(product.prix) * quantite).toFixed(2)} €</td>
              <td>
                <button className="btn btn-outline" onClick={() => removeFromCart(product.id)}>
                  Retirer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ marginTop: 16, fontWeight: 700 }}>Total : {total.toFixed(2)} €</p>
      <button className="btn btn-primary" onClick={handleCheckout}>Passer commande</button>
    </div>
  );
}
