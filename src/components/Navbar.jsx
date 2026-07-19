import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const cartCount = items.reduce((sum, i) => sum + i.quantite, 0);

  return (
    <nav className="navbar">
      <Link to="/"><strong>Ma Boutique</strong></Link>
      <div className="navbar-links">
        <Link to="/">Produits</Link>
        <Link to="/cart">Panier ({cartCount})</Link>
        {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
        {user ? (
          <>
            <span className="muted">{user.email}</span>
            <button className="btn btn-outline" onClick={logout}>Déconnexion</button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary">Connexion</Link>
        )}
      </div>
    </nav>
  );
}
