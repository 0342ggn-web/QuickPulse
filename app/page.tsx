'use client';

import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planType: string) => {
    setLoading(planType);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planType }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Error al iniciar el pago con Stripe');
      }
    } catch (error) {
      console.error(error);
      alert('Hubo un error de conexión');
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-between p-8">
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center py-4 border-b border-slate-800">
        <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          QuickPulse Pro
        </h1>
        <span className="text-sm text-slate-400">Panel de Suscripción</span>
      </header>

      {/* Hero Section */}
      <section className="text-center my-10 max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          Mide el pulso de tu negocio al instante
        </h2>
        <p className="text-lg text-slate-400 mb-8">
          Selecciona el plan que mejor se adapte a tus necesidades y disfruta de todas las ventajas en tiempo real.
        </p>
      </section>

      {/* Pricing Section (3 Planes) */}
      <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {/* Plan Mensual */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="text-xl font-semibold mb-2">Mensual</h3>
            <p className="text-slate-400 text-sm mb-6">Flexibilidad mes a mes para tu proyecto.</p>
            <div className="text-3xl font-bold mb-6">4,99 €<span className="text-sm text-slate-400 font-normal"> / mes</span></div>
            <ul className="space-y-3 text-sm text-slate-300 mb-8">
              <li className="flex items-center">✓ Acceso completo al panel</li>
              <li className="flex items-center">✓ Actualizaciones en tiempo real</li>
            </ul>
          </div>
          <button
            onClick={() => handleSubscribe('monthly')}
            disabled={loading === 'monthly'}
            className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition duration-200 cursor-pointer"
          >
            {loading === 'monthly' ? 'Procesando...' : 'Elegir Mensual'}
          </button>
        </div>

        {/* Plan Trimestral */}
        <div className="bg-gradient-to-b from-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 flex flex-col justify-between shadow-xl relative">
          <div className="absolute -top-3 right-6 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Popular
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Trimestral</h3>
            <p className="text-slate-400 text-sm mb-6">Ahorro inteligente cada 3 meses.</p>
            <div className="text-3xl font-bold mb-6">16,99 €<span className="text-sm text-slate-400 font-normal"> / 3 meses</span></div>
            <ul className="space-y-3 text-sm text-slate-300 mb-8">
              <li className="flex items-center">✓ Todo lo del plan mensual</li>
              <li className="flex items-center">✓ Soporte prioritario</li>
            </ul>
          </div>
          <button
            onClick={() => handleSubscribe('quarterly')}
            disabled={loading === 'quarterly'}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition duration-200 shadow-lg shadow-indigo-600/30 cursor-pointer"
          >
            {loading === 'quarterly' ? 'Procesando...' : 'Elegir Trimestral'}
          </button>
        </div>

        {/* Plan Anual */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="text-xl font-semibold mb-2">Anual</h3>
            <p className="text-slate-400 text-sm mb-6">Máximo ahorro para proyectos consolidados.</p>
            <div className="text-3xl font-bold mb-6">40,99 €<span className="text-sm text-slate-400 font-normal"> / año</span></div>
            <ul className="space-y-3 text-sm text-slate-300 mb-8">
              <li className="flex items-center">✓ Acceso total sin interrupciones</li>
              <li className="flex items-center">✓ Soporte VIP 24/7</li>
            </ul>
          </div>
          <button
            onClick={() => handleSubscribe('yearly')}
            disabled={loading === 'yearly'}
            className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition duration-200 cursor-pointer"
          >
            {loading === 'yearly' ? 'Procesando...' : 'Elegir Anual'}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-6xl text-center py-6 border-t border-slate-900 text-xs text-slate-500">
        QuickPulse © 2026. Todos los derechos reservados.
      </footer>
    </main>
  );
}