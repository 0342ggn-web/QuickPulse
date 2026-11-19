'use client';
import SubscribeButton from '@/components/SubscribeButton';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser, SignInButton, UserButton } from '@clerk/nextjs';

interface ReceiptList {
  id: string;
  name: string;
  icon: string;
}

interface Transaction {
  id: number;
  listId: string;
  text: string;
  amount: number;
  date: string;
}

const DEFAULT_LISTS: ReceiptList[] = [
  { id: 'comida', name: 'Comida', icon: '🍔' },
  { id: 'casa', name: 'Casa (Luz, Agua...)', icon: '🏠' },
  { id: 'ocio', name: 'Ocio', icon: '🎉' },
];

const FREE_LIST_LIMIT = 3;

export default function Home() {
  const { isSignedIn, user } = useUser();

  // Detecta automáticamente si el usuario es Pro a través de Clerk (actualizado por el Webhook)
  const isPro = Boolean(user?.publicMetadata?.isPro);

  const [lists, setLists] = useState<ReceiptList[]>(DEFAULT_LISTS);
  const [activeListId, setActiveListId] = useState<string>('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [inputText, setInputText] = useState('');
  const [inputAmount, setInputAmount] = useState('');
  const [selectedFormList, setSelectedFormList] = useState<string>('comida');

  // Estados para crear nueva lista o mostrar muro de pago
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [showPaywallAlert, setShowPaywallAlert] = useState(false);

  // Cargar datos guardados en el navegador al abrir la app
  useEffect(() => {
    const savedLists = localStorage.getItem('quickpulse_lists');
    const savedTransactions = localStorage.getItem('quickpulse_transactions');
    if (savedLists) {
      const parsedLists = JSON.parse(savedLists);
      setLists(parsedLists);
      if (parsedLists.length > 0) setSelectedFormList(parsedLists[0].id);
    }
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  // Guardar automáticamente cada cambio
  useEffect(() => {
    localStorage.setItem('quickpulse_lists', JSON.stringify(lists));
  }, [lists]);

  useEffect(() => {
    localStorage.setItem('quickpulse_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Filtrar movimientos según la lista seleccionada
  const filteredTransactions =
    activeListId === 'all'
      ? transactions
      : transactions.filter((t) => t.listId === activeListId);

  const totalBalance = filteredTransactions.reduce((acc, t) => acc + t.amount, 0);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText || !inputAmount) return;

    const targetList = activeListId === 'all' ? selectedFormList : activeListId;

    const newTransaction: Transaction = {
      id: Date.now(),
      listId: targetList,
      text: inputText,
      amount: parseFloat(inputAmount),
      date: new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    };

    setTransactions([newTransaction, ...transactions]);
    setInputText('');
    setInputAmount('');
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  // Botón "+ Nueva Lista" con comprobación del límite gratuito
  const handleNewListClick = () => {
    if (!isPro && lists.length >= FREE_LIST_LIMIT) {
      setShowPaywallAlert(true);
      setIsAddingList(false);
      return;
    }
    setShowPaywallAlert(false);
    setIsAddingList(!isAddingList);
  };

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    if (!isPro && lists.length >= FREE_LIST_LIMIT) {
      setShowPaywallAlert(true);
      return;
    }

    const newList: ReceiptList = {
      id: `list_${Date.now()}`,
      name: newListName.trim(),
      icon: '📁',
    };

    setLists([...lists, newList]);
    setActiveListId(newList.id);
    setSelectedFormList(newList.id);
    setNewListName('');
    setIsAddingList(false);
  };

  const handleDeleteList = (listId: string) => {
    if (lists.length <= 1) return; // Mantener al menos 1 lista
    const updatedLists = lists.filter((l) => l.id !== listId);
    setLists(updatedLists);
    setTransactions(transactions.filter((t) => t.listId !== listId));
    if (activeListId === listId) setActiveListId('all');
    setShowPaywallAlert(false);
  };

  const activeListObj = lists.find((l) => l.id === activeListId);

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-3 sm:p-6 md:p-10 overflow-x-hidden">
      {/* Header adaptable: título a la derecha en móvil y botones debajo */}
      <header className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 py-4 border-b border-slate-800">
        <h1 className="w-full sm:w-auto text-right sm:text-left text-2xl sm:text-3xl font-extrabold tracking-tight text-cyan-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)] bg-gradient-to-r from-cyan-300 to-teal-400 bg-clip-text text-transparent">
          QuickPulse
        </h1>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-start sm:justify-end gap-2 sm:gap-4">
          <Link
            href="/pricing"
            className="w-full sm:w-auto px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-medium rounded-lg transition text-center"
          >
            Panel de Suscripción
          </Link>

          {/* Botón de suscripción con texto actualizado en su componente */}
          <div className="w-full sm:w-auto flex justify-center sm:inline-flex items-center">
            <SubscribeButton />
          </div>

          {/* Botones de Autenticación de Clerk compatibles */}
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button className="w-full sm:w-auto px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-medium rounded-lg transition cursor-pointer">
                Iniciar Sesión
              </button>
            </SignInButton>
          ) : (
            <div className="flex justify-end">
              <UserButton />
            </div>
          )}
        </div>
      </header>

      {/* Main Dashboard Content */}
      <section className="w-full max-w-4xl mx-auto my-6 space-y-6">
        {/* Banner de Bienvenida optimizado para móvil */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-5 sm:p-8 text-white shadow-xl border border-indigo-500/20">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <span className="inline-block rounded-full bg-indigo-500/20 px-3.5 py-1 text-xs font-semibold text-indigo-300 mb-3 border border-indigo-500/30">
              ✨ QuickPulse Pro
            </span>

            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight mb-3 text-white leading-snug sm:leading-tight">
              ¡Te doy la bienvenida a QuickPulse{' '}
              <span className="text-indigo-400 font-normal text-base sm:text-2xl block sm:inline">
                (que el nombre no te engañe)
              </span>
              !
            </h2>

            <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
              Empieza a ver tus recibos con una sonrisa! Aquí te divertirás con las cuentas y aprenderás a controlar tus gastos hormiga para que tu día a día se llene de gratitud al ver que tus cuentas van siendo más positivas.
            </p>
          </div>
        </div>

        {/* Tarjeta de Métricas y Saludo de Usuario */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-8 shadow-2xl">
          <div className="mb-6">
            <h3 className="text-lg sm:text-2xl font-bold text-white mb-1">
              {isSignedIn && user?.firstName
                ? `Hola de nuevo, ${user.firstName}`
                : 'Hola de nuevo, Usuario'}
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm">
              Organiza tus recibos por listas y controla tus gastos del mes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 sm:p-5">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {activeListId === 'all'
                  ? 'Balance Total (Todas las listas)'
                  : `Balance: ${activeListObj?.name}`}
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {totalBalance.toLocaleString('es-ES', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                €
              </div>
              <span className="text-xs text-slate-500 font-medium mt-2 inline-block">
                {filteredTransactions.length === 0
                  ? 'Sin movimientos registrados'
                  : 'Actualizado al instante'}
              </span>
            </div>

            <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 sm:p-5">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Listas de Recibos
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {lists.length}{' '}
                {!isPro && (
                  <span className="text-sm sm:text-base font-normal text-slate-500">
                    / {FREE_LIST_LIMIT} gratis
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-500 font-medium mt-2 inline-block">
                {filteredTransactions.length} recibos en esta vista
              </span>
            </div>
          </div>

          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Estado del Plan
              </span>
              <div className="text-base sm:text-lg font-bold text-indigo-400 mt-0.5">
                {isPro ? 'QuickPulse Pro (Listas Ilimitadas)' : 'Plan Gratuito (Hasta 3 listas)'}
              </div>
            </div>
            {!isPro && (
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition duration-200 text-center"
              >
                Desbloquear listas ilimitadas
              </Link>
            )}
          </div>
        </div>

        {/* Selector de Listas de Recibos */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-8 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h3 className="text-base sm:text-lg font-bold text-white">Tus Listas de Recibos</h3>
            <button
              onClick={handleNewListClick}
              className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold rounded-lg transition cursor-pointer"
            >
              + Nueva Lista
            </button>
          </div>

          {/* Aviso de Límite Alcanzado (Paywall) */}
          {showPaywallAlert && (
            <div className="mb-6 bg-indigo-950/60 border border-indigo-500/50 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-indigo-300 text-sm">
                  🔒 Has alcanzado el límite de 3 listas gratuitas
                </h4>
                <p className="text-slate-300 text-xs mt-1">
                  Crea listas ilimitadas para separar luz, agua, alquiler, suscripciones o viajes con QuickPulse Pro.
                </p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                <Link
                  href="/pricing"
                  className="w-full sm:w-auto text-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition shadow-lg shadow-indigo-600/30"
                >
                  Ver Planes Pro
                </Link>
                <button
                  onClick={() => setShowPaywallAlert(false)}
                  className="px-2 py-2 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Formulario rápido para crear nueva lista */}
          {isAddingList && (
            <form onSubmit={handleCreateList} className="mb-6 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Nombre de la lista (ej. Coche, Gimnasio...)"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                autoFocus
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition cursor-pointer"
              >
                Crear
              </button>
            </form>
          )}

          {/* Pestañas de Listas */}
          <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
            <button
              onClick={() => setActiveListId('all')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeListId === 'all'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              📊 Todas ({transactions.length})
            </button>

            {lists.map((list) => {
              const count = transactions.filter((t) => t.listId === list.id).length;
              return (
                <div key={list.id} className="flex items-center">
                  <button
                    onClick={() => {
                      setActiveListId(list.id);
                      setSelectedFormList(list.id);
                    }}
                    className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-2 ${
                      activeListId === list.id
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span>{list.icon}</span>
                    <span>{list.name}</span>
                    <span className="opacity-70">({count})</span>
                  </button>
                  {lists.length > 1 && (
                    <button
                      onClick={() => handleDeleteList(list.id)}
                      title={`Eliminar lista ${list.name}`}
                      className="ml-1 text-slate-600 hover:text-rose-400 text-xs px-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sección para Añadir Gastos / Movimientos */}
          <h3 className="text-base sm:text-lg font-bold mb-3">
            Añadir Recibo o Movimiento{' '}
            {activeListId !== 'all' && activeListObj ? `en ${activeListObj.name}` : ''}
          </h3>

          <form
            onSubmit={handleAddTransaction}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-8"
          >
            {activeListId === 'all' && (
              <select
                value={selectedFormList}
                onChange={(e) => setSelectedFormList(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-indigo-500 text-sm"
              >
                {lists.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.icon} {l.name}
                  </option>
                ))}
              </select>
            )}

            <input
              type="text"
              placeholder="Concepto (ej. Recibo luz)"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className={`bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm ${
                activeListId === 'all' ? 'md:col-span-1' : 'md:col-span-2'
              }`}
            />

            <input
              type="number"
              step="0.01"
              placeholder="Cantidad (€) (ej. -45.50)"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
            />

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl px-4 py-3 transition duration-200 text-sm cursor-pointer shadow-lg shadow-indigo-600/30"
            >
              Añadir recibo
            </button>
          </form>

          {/* Lista de Últimos Movimientos */}
          <h4 className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            {activeListId === 'all'
              ? 'Todos los Recibos'
              : `Recibos en ${activeListObj?.name}`}
          </h4>

          <div className="space-y-3">
            {filteredTransactions.length === 0 ? (
              <p className="text-slate-500 text-xs sm:text-sm italic text-center py-4">
                No hay recibos en esta lista todavía. Añade el primero arriba.
              </p>
            ) : (
              filteredTransactions.map((t) => {
                const parentList = lists.find((l) => l.id === t.listId);
                return (
                  <div
                    key={t.id}
                    className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-sm sm:text-base text-white">{t.text}</span>
                        {activeListId === 'all' && parentList && (
                          <span className="text-[10px] sm:text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                            {parentList.icon} {parentList.name}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500">{t.date}</span>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/80">
                      <div
                        className={`font-bold text-sm sm:text-base ${
                          t.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {t.amount > 0 ? `+${t.amount.toFixed(2)} €` : `${t.amount.toFixed(2)} €`}
                      </div>
                      <button
                        onClick={() => handleDeleteTransaction(t.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                        title="Eliminar movimiento"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })
            )}
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