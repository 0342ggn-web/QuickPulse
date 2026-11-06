'use client';

export default function Home() {
  const handleSubscribe = async (priceId: string) => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-sm w-full">
        <h3 className="font-bold text-xl mb-2 text-gray-800">Enterprise</h3>
        <p className="text-gray-600 mb-6">Uso avanzado</p>
        <button
          onClick={() => handleSubscribe('price_1UY98RLEgmrxu99QFHFrzeeH')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition"
        >
          Suscribirse
        </button>
      </div>
    </main>
  );
}