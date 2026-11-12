'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Transaction {
  id: number;
  text: string;
  amount: number;
  date: string;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, text: 'Suscripción Pro Mensual', amount: 4.99, date: '12 de Noviembre, 2026' },
  ]);
  const [inputText, setInputText] = useState('');
  const [inputAmount, setInputAmount] = useState('');

  // Calcular el balance total sumando los gastos/ingresos añadidos + la base inicial
  const baseBalance = 12475.51;
  const totalBalance = baseBalance + transactions.reduce((acc, t) => acc + t.amount, 0);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText || !inputAmount) return;

    const newTransaction: Transaction = {
      id: Date.now(),
      text: inputText,
      amount: parseFloat(inputAmount),
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
    };

    setTransactions([newTransaction, ...transactions]);
    setInputText('');
    setInputAmount('');
  };

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

      {/* Main Dashboard Content */}
      <section className="w-full max-w-4xl mx-auto my-auto space-y-6">
        
        {/* Tarjeta de Bienvenida y Métricas */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
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
              <div className="text-3xl font-extrabold text-white mt-1">
                {totalBalance.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
              </div>
              <span className="text-xs text-emerald-400 font-medium mt-2 inline-block">+14% este mes</span>
            </div>

            <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-5">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Movimientos Activos</span>
              <div className="text-3xl font-extrabold text-white mt-1">{1428 + transactions.length}</div>
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
        </div>

        {/* Sección para Añadir Gastos / Movimientos */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <h3 className="text-xl font-bold mb-4">Añadir Nuevo Movimiento</h3>
          
          <form onSubmit={handleAddTransaction} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <input
              type="text"
              placeholder="Concepto (ej. Café)"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Cantidad (€) (ej. 1.50)"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl px-4 py-3 transition duration-200 text-sm cursor-pointer shadow-lg shadow-indigo-600/30"
            >
              Añadir a la lista
            </button>
          </form>

          {/* Lista de Últimos Movimientos */}
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Últimos Movimientos</h4>
          <div className="space-y-3">
            {transactions.map((t) => (
              <div key={t.id} className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">{t.text}</div>
                  <span className="text-xs text-slate-500">{t.date}</span>
                </div>
                <div className={`font-bold ${t.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {t.amount > 0 ? `+${t.amount.toFixed(2)} €` : `${t.amount.toFixed(2)} €`}
                </div>
              </div>
            ))}
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