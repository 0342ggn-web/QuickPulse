'use client';

export default function SubscribeButton() {
  const handleSubscribe = () => {
    const checkoutUrl = process.env.NEXT_PUBLIC_POLAR_CHECKOUT_URL;
    
    if (!checkoutUrl) {
      console.error('La URL de checkout de Polar no está configurada.');
      alert('La URL de pago de Polar no está configurada en .env.local');
      return;
    }

    // Redirige directamente al enlace oficial de Polar
    window.location.href = checkoutUrl;
  };

  return (
    <button
      onClick={handleSubscribe}
      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow transition-colors"
    >
      Suscribirse a QuickPulse Pro (4,99 €/mes)
    </button>
  );
}