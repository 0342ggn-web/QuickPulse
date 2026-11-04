'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Expense {
  id: string
  category: string
  amount: number
  created_at: string
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setExpenses(data)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !amount) return

    setLoading(true)

    const { error } = await supabase
      .from('expenses')
      .insert([
        {
          category: title,
          amount: parseFloat(amount),
        },
      ])

    setLoading(false)

    if (error) {
      alert('Error al guardar el gasto: ' + error.message)
      return
    }

    setTitle('')
    setAmount('')
    setShowModal(false)
    fetchExpenses()
  }

  const deleteExpense = async (id: string) => {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error al eliminar el gasto: ' + error.message)
      return
    }

    fetchExpenses()
  }

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0)

  return (
    <main className="min-h-screen bg-gray-50 p-4 font-sans text-gray-900 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-4">
          <h1 className="text-2xl font-bold tracking-tight">QuickPulse</h1>
          <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2.5 py-1 rounded-full">
            Micro-SaaS
          </span>
        </div>

        {/* Resumen Total */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Gasto Total</p>
          <p className="text-4xl font-extrabold mt-2 text-gray-900">
            {totalExpenses.toFixed(2)} €
          </p>
        </div>

        {/* Lista de Gastos */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-700">Historial</h2>
          {expenses.length === 0 ? (
            <p className="text-sm text-gray-400 italic text-center py-6">
              No hay gastos registrados aún.
            </p>
          ) : (
            expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
              >
                <div>
                  <p className="font-semibold text-gray-800">{expense.category}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(expense.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-gray-900">
                    -{expense.amount.toFixed(2)} €
                  </span>
                  <button
                    onClick={() => deleteExpense(expense.id)}
                    className="text-gray-300 hover:text-red-500 p-1 transition-colors text-sm font-bold"
                    title="Eliminar gasto"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Botón Flotante / Modal Trigger */}
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-6 right-6 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors font-bold text-lg flex items-center justify-center w-14 h-14"
        >
          +
        </button>

        {/* Modal de Registro */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl space-y-4 relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
              <h3 className="text-lg font-bold">Registrar nuevo gasto</h3>

              <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Concepto
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej. Café"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Importe (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm text-gray-500 font-medium hover:text-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 disabled:opacity-50"
                  >
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}