import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../services/api';
import { useCart } from '../context/CartContext';

// Clé PUBLIQUE Stripe — vient de ton .env frontend (VITE_STRIPE_PUBLIC_KEY)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm() {
  const { items, total, clearCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setError('');

    try {
      // 1. Créer la commande côté backend
      const orderPayload = {
        items: items.map(({ product, quantite }) => ({ product_id: product.id, quantite })),
      };
      const { data: order } = await api.post('/orders', orderPayload);

      // 2. Créer le PaymentIntent Stripe pour cette commande
      const { data: paymentData } = await api.post('/payment/create-intent', {
        orderId: order.orderId,
      });

      // 3. Confirmer le paiement avec la carte saisie
      const result = await stripe.confirmCardPayment(paymentData.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        clearCart();
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du paiement.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <p>Total à payer : <strong>{total.toFixed(2)} €</strong></p>
      <div style={{ padding: 12, border: '1px solid var(--color-border)', borderRadius: 8 }}>
        <CardElement />
      </div>
      {error && <p className="error">{error}</p>}
      <button className="btn btn-primary" type="submit" disabled={!stripe || processing}>
        {processing ? 'Traitement...' : 'Payer'}
      </button>
      <p className="muted">
        Mode test Stripe : utilise la carte 4242 4242 4242 4242, date future, CVC quelconque.
      </p>
    </form>
  );
}

export default function Checkout() {
  return (
    <div className="container">
      <h1>Paiement</h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}
