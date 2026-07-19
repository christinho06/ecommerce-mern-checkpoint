import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await register(form.nom, form.prenom, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription.");
    }
  }

  return (
    <div className="container">
      <h1>Inscription</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input placeholder="Nom" value={form.nom} onChange={update('nom')} required />
        <input placeholder="Prénom" value={form.prenom} onChange={update('prenom')} required />
        <input type="email" placeholder="Email" value={form.email} onChange={update('email')} required />
        <input type="password" placeholder="Mot de passe" value={form.password} onChange={update('password')} required />
        {error && <p className="error">{error}</p>}
        <button className="btn btn-primary" type="submit">S'inscrire</button>
      </form>
      <p className="muted">Déjà un compte ? <Link to="/login">Se connecter</Link></p>
    </div>
  );
}
