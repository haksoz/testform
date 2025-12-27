'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({ ad: '', soyad: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [title, setTitle] = useState<string>('');
  const [titleLoading, setTitleLoading] = useState(true);
  const [titleError, setTitleError] = useState<string | null>(null);

  // Sayfa yüklendiğinde veritabanından başlığı çek
  useEffect(() => {
    const fetchTitle = async () => {
      try {
        setTitleLoading(true);
        setTitleError(null);
        const response = await fetch('/api/settings');
        const data = await response.json();
        
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Başlık yüklenemedi');
        }
        
        if (data.title) {
          setTitle(data.title);
        } else {
          throw new Error('Başlık bulunamadı');
        }
      } catch (error: any) {
        console.error('Başlık yüklenirken hata:', error);
        setTitleError(error.message || 'Veritabanı bağlantısı başarısız');
      } finally {
        setTitleLoading(false);
      }
    };

    fetchTitle();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Kayıt başarıyla eklendi!' });
        setFormData({ ad: '', soyad: '' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Bir hata oluştu' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Bağlantı hatası oluştu' });
    } finally {
      setLoading(false);
    }
  };

  // Eğer başlık yükleniyorsa veya hata varsa özel görünüm
  if (titleLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
          <p className="text-gray-600">Başlık yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (titleError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <div className="bg-red-100 text-red-800 border border-red-200 p-4 rounded-md">
            <h2 className="font-bold text-lg mb-2">Hata!</h2>
            <p className="mb-2">{titleError}</p>
            <p className="text-sm text-red-600">Veritabanı bağlantısı kurulamadı. Lütfen daha sonra tekrar deneyin.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {title}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="ad" className="block text-sm font-medium text-gray-700 mb-1">
              Ad
            </label>
            <input
              type="text"
              id="ad"
              value={formData.ad}
              onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Adınızı girin"
            />
          </div>

          <div>
            <label htmlFor="soyad" className="block text-sm font-medium text-gray-700 mb-1">
              Soyad
            </label>
            <input
              type="text"
              id="soyad"
              value={formData.soyad}
              onChange={(e) => setFormData({ ...formData, soyad: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Soyadınızı girin"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 rounded-md ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}

