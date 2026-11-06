'use client';

export default function Home() {
  const handleSubscribe = async (priceId: string) => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow border">
        <h3 className="font-bold text-lg mb-2 text-gray-800">Enterprise</h3>
        <p className="text-gray-600 mb-4">Uso avanzado</p>
        <button
          onClick={() => handleSubscribe('price_1UY98RLEgmrxu99QFHFrzeeH')}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Suscribirse
        </button>
      </div>
    </div>
  );
}