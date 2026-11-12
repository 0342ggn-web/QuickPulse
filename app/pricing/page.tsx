'use client';

import { useState } from 'react';

export default function DashboardPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (plan: string) => {
    try {
      setLoading(plan);
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Error al conectar con la pasarela de pago');
      }
    } catch (err) {
      console.error(err);
      alert('Error de red al procesar el pago');
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Cabecera / Bienvenida */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Bienvenido de nuevo, Usuario 👋</h1>
            <p className="text-slate-400 mt-1">Aquí tienes el resumen de tus métricas y actividad reciente.</p>
          </div>
          <a
            href="#planes"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-lg shadow-indigo-500/20"
          >
            Ver Planes y Suscripción ⚡
          </a>
        </header>

        {/* Sección de Totales y Movimientos (Dashboard) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <p className="text-sm font-medium text-slate-400">Balance Total</p>
            <h3 className="text-3xl font-bold mt-2 text-emerald-400">12.480,50 €</h3>
            <span className="text-xs text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md mt-3 inline-block">+14% este mes</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <p className="text-sm font-medium text-slate-400">Movimientos Activos</p>
            <h3 className="text-3xl font-bold mt-2 text-indigo-400">1,429</h3>
            <span className="text-xs text-indigo-500 bg-indigo-500/10 px-2 py-1 rounded-md mt-3 inline-block">Sincronizado en tiempo real</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <p className="text-sm font-medium text-slate-400">Estado del Plan</p>
            <h3 className="text-3xl font-bold mt-2 text-amber-400">Free Trial</h3>
            <span className="text-xs text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md mt-3 inline-block">Actualiza para desbloquear todo</span>
          </div>
        </section>

        {/* Listado de Movimientos Recientes */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-semibold mb-4 text-slate-200">Últimos Movimientos</h3>
          <div className="divide-y divide-slate-800">
            <div className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-slate-200">Suscripción Pro (Mensual)</p>
                <p className="text-xs text-slate-400">12 de Noviembre, 2026</p>
              </div>
              <span className="text-emerald-400 font-semibold">+4,99 €</span>
            </div>
            <div className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-slate-200">Auditoría de Métricas API</p>
                <p className="text-xs text-slate-400">10 de Noviembre, 2026</p>
              </div>
              <span className="text-slate-300 font-semibold">Completado</span>
            </div>
            <div className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-slate-200">Optimización de Servidor Vercel</p>
                <p className="text-xs text-slate-400">08 de Noviembre, 2026</p>
              </div>
              <span className="text-slate-300 font-semibold">Completado</span>
            </div>
          </div>
        </section>

        {/* Sección de Precios y Suscripciones */}
        <section id="planes" className="pt-10 border-t border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold">Elige tu plan de crecimiento</h2>
            <p className="text-slate-400 mt-2">Desbloquea todo el potencial de nuestra plataforma con pasarela de pago segura mediante Stripe.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Mensual */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-xl">
              <div>
                <h3 className="text-xl font-semibold">Mensual</h3>
                <p className="text-slate-400 text-sm mt-1">Ideal para empezar y probar.</p>
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
                onClick={() => handleCheckout('mensual')}
                disabled={loading === 'mensual'}
                className="mt-8 w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl transition"
              >
                {loading === 'mensual' ? 'Redirigiendo...' : 'Elegir Mensual'}
              </button>
            </div>

            {/* Trimestral (Popular) */}
            <div className="bg-slate-900 border-2 border-indigo-500 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative">
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
                onClick={() => handleCheckout('trimestral')}
                disabled={loading === 'trimestral'}
                className="mt-8 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition shadow-lg shadow-indigo-600/30"
              >
                {loading === 'trimestral' ? 'Redirigiendo...' : 'Elegir Trimestral'}
              </button>
            </div>

            {/* Anual */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-xl">
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
                onClick={() => handleCheckout('anual')}
                disabled={loading === 'anual'}
                className="mt-8 w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl transition"
              >
                {loading === 'anual' ? 'Redirigiendo...' : 'Elegir Anual'}
              </button>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}