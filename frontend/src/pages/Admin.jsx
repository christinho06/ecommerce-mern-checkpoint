import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const emptyProduct = { nom: '', description: '', prix: '', stock: '', image_url: '' };

export default function Admin() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  function loadProducts() {
    api.get('/products').then((res) => setProducts(res.data));
  }

  function loadOrders() {
    api.get('/admin/orders').then((res) => setOrders(res.data)).catch(() => {});
  }

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, form);
      } else {
        await api.post('/products', form);
      }
      setForm(emptyProduct);
      setEditingId(null);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur.');
    }
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      nom: product.nom,
      description: product.description || '',
      prix: product.prix,
      stock: product.stock,
      image_url: product.image_url || '',
    });
  }

  async function handleDelete(id) {
    await api.delete(`/products/${id}`);
    loadProducts();
  }

  // Le backend renvoie déjà 403 pour les non-admins, mais on adapte aussi l'UI ici
  if (user?.role !== 'admin') {
    return <div className="container"><p className="error">Accès réservé aux administrateurs.</p></div>;
  }

  return (
    <div className="container">
      <h1>Panel admin</h1>

      <h2>{editingId ? 'Modifier le produit' : 'Ajouter un produit'}</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input placeholder="Nom" value={form.nom} onChange={update('nom')} required />
        <textarea placeholder="Description" value={form.description} onChange={update('description')} />
        <input type="number" step="0.01" placeholder="Prix" value={form.prix} onChange={update('prix')} required />
        <input type="number" placeholder="Stock" value={form.stock} onChange={update('stock')} required />
        <input placeholder="URL de l'image" value={form.image_url} onChange={update('image_url')} />
        {error && <p className="error">{error}</p>}
        <button className="btn btn-primary" type="submit">
          {editingId ? 'Enregistrer' : 'Ajouter'}
        </button>
        {editingId && (
          <button type="button" className="btn btn-outline" onClick={() => { setEditingId(null); setForm(emptyProduct); }}>
            Annuler
          </button>
        )}
      </form>

      <h2 style={{ marginTop: 32 }}>Produits</h2>
      <table>
        <thead>
          <tr><th>Nom</th><th>Prix</th><th>Stock</th><th></th></tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.nom}</td>
              <td>{parseFloat(p.prix).toFixed(2)} €</td>
              <td>{p.stock}</td>
              <td>
                <button className="btn btn-outline" onClick={() => startEdit(p)}>Modifier</button>{' '}
                <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: 32 }}>Commandes</h2>
      <table>
        <thead>
          <tr><th>ID</th><th>Statut</th><th>Total</th><th>Date</th></tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.statut}</td>
              <td>{parseFloat(o.total).toFixed(2)} €</td>
              <td>{new Date(o.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
