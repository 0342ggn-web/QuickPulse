'use client';

import { useState } from 'react';

export default function SubscribeButton() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          couponId: 'LANZAMIENTO339',
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.url) {
        throw new Error(data?.error || 'No se pudo iniciar el pago con Stripe.');
      }

      window.location.href = data.url;
    } catch (error) {
      console.error('Error al iniciar el checkout de Stripe:', error);
      alert('No se pudo abrir la pasarela de pago. Revisa la configuración de Stripe.');
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSubscribe}
      disabled={loading}
      className="px-6 py-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-slate-950 font-bold rounded-xl shadow transition-colors cursor-pointer"
    >
      {loading
        ? 'Redirigiendo a Stripe...'
        : '¡SUSCRÍBETE YA! QuickPulse Pro: 3,39 € el 1.er mes (luego 4,99 €/mes)'}
    </button>
  );
}