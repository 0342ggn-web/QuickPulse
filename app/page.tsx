'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-8">
      {/* Header */}
      <header className="w-full max-w-6xl mx-auto flex justify-between items-center py-4 border-b border-slate-800">
        <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          QuickPulse
        </h1>
        <Link 
          href="/pricing" 
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition duration-200"
        >
          Panel de Suscripción
        </Link>
      </header>

      {/* Main Dashboard Content (Bienvenida) */}
      <section className="w-full max-w-4xl mx-auto my-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Bienvenido de nuevo, Usuario
          </h2>
          <p className="text-slate-400 text-sm">
            Aquí tienes el resumen de tus métricas y actividad reciente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-5">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Balance Total</span>
            <div className="text-3xl font-extrabold text-white mt-1">12.480,50 €</div>
            <span className="text-xs text-emerald-400 font-medium mt-2 inline-block">+14% este mes</span>
          </div>

          <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-5">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Movimientos Activos</span>
            <div className="text-3xl font-extrabold text-white mt-1">1.429</div>
            <span className="text-xs text-slate-400 font-medium mt-2 inline-block">Sincronizado en tiempo real</span>
          </div>
        </div>

        <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Estado del Plan</span>
            <div className="text-lg font-bold text-indigo-400 mt-0.5">Free Trial</div>
          </div>
          <Link 
            href="/pricing"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition duration-200"
          >
            Actualiza para desbloquear todo
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto text-center py-6 border-t border-slate-900 text-xs text-slate-500">
        QuickPulse © 2026. Todos los derechos reservados.
      </footer>
    </main>
  );
}