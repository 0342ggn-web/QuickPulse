'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const checkoutLinks: Record<string, string> = {
    monthly: 'https://qpulse.lemonsqueezy.com/checkout/buy/08553b4f-a66e-49de-9a5f-34bb5cbae8eb',
    quarterly: 'https://qpulse.lemonsqueezy.com/checkout/buy/218a3438-cb52-4512-9775-b2ad92d90a9a',
    yearly: 'https://qpulse.lemonsqueezy.com/checkout/buy/c817ef00-f139-406b-a5c7-c02feb86d78d',
  };

  const handleCheckout = (plan: string) => {
    setLoading(plan);
    const url = checkoutLinks[plan];
    if (url) {
      window.location.href = url;
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-8">
      {/* Header */}
      <header className="w-full max-w-6xl mx-auto flex justify-between items-center py-4 border-b border-slate-800">
        <Link 
          href="/" 
          className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent"
        >
          QuickPulse
        </Link>
        <Link 
          href="/" 
          className="text-sm text-slate-400 hover:text-white transition duration-200"
        >
          ← Volver al panel
        </Link>
      </header>

      {/* Sección de Precios */}
      <section className="w-full max-w-5xl mx-auto my-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
            Elige el plan perfecto para ti
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Desbloquea métricas ilimitadas, reportes avanzados y sincronización total para gestionar tus finanzas sin límites.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Plan Mensual */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold">Mensual</h3>
              <p className="text-slate-400 text-sm mt-1">Ideal para empezar a probar.</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold">4,99 €</span>
                <span className="text-slate-400 text-sm"> / mes</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li>✓ Acceso completo al panel</li>
                <li>✓ Soporte estándar</li>
                <li>✓ Métricas en tiempo real</li>
              </ul>
            </div>
            <button
              onClick={() => handleCheckout('monthly')}
              disabled={loading === 'monthly'}
              className="mt-8 w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl transition duration-200 cursor-pointer"
            >
              {loading === 'monthly' ? 'Redirigiendo...' : 'Elegir Mensual'}
            </button>
          </div>

          {/* Plan Trimestral (Popular) */}
          <div className="bg-slate-900 border-2 border-indigo-500 rounded-3xl p-8 flex flex-col justify-between relative shadow-2xl shadow-indigo-500/10">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              Popular
            </span>
            <div>
              <h3 className="text-xl font-semibold">Trimestral</h3>
              <p className="text-slate-400 text-sm mt-1">Ahorro y constancia.</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold">16,99 €</span>
                <span className="text-slate-400 text-sm"> / 3 meses</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li>✓ Todo lo del plan mensual</li>
                <li>✓ Prioridad en servidores</li>
                <li>✓ Reportes avanzados</li>
              </ul>
            </div>
            <button
              onClick={() => handleCheckout('quarterly')}
              disabled={loading === 'quarterly'}
              className="mt-8 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition duration-200 cursor-pointer shadow-lg shadow-indigo-600/30"
            >
              {loading === 'quarterly' ? 'Redirigiendo...' : 'Elegir Trimestral'}
            </button>
          </div>

          {/* Plan Anual */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold">Anual</h3>
              <p className="text-slate-400 text-sm mt-1">Máximo ahorro a largo plazo.</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold">40,99 €</span>
                <span className="text-slate-400 text-sm"> / año</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li>✓ Todo incluido sin límites</li>
                <li>✓ Soporte VIP prioritario 24/7</li>
                <li>✓ Acceso anticipado a funciones</li>
              </ul>
            </div>
            <button
              onClick={() => handleCheckout('yearly')}
              disabled={loading === 'yearly'}
              className="mt-8 w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl transition duration-200 cursor-pointer"
            >
              {loading === 'yearly' ? 'Redirigiendo...' : 'Elegir Anual'}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto text-center py-6 border-t border-slate-900 text-xs text-slate-500">
        QuickPulse © 2026. Todos los derechos reservados.
      </footer>
    </main>
  );
}