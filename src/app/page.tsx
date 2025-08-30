'use client';

import Link from 'next/link';
import { Recipe } from '@/types';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Fungsi untuk mengambil data resep dari backend
// Kita menggunakan { cache: 'no-store' } untuk memastikan data selalu baru setiap kali halaman di-refresh (baik untuk development)
async function getRecipes(): Promise<Recipe[]> {
  try {
    const res = await fetch('http://localhost:3001/api/recipes', { cache: 'no-store' });

    if (!res.ok) {
      throw new Error('Gagal mengambil data resep dari backend');
    }

    return res.json();
  } catch (error) {
    console.error(error);
    // Mengembalikan array kosong jika terjadi error agar halaman tidak rusak
    return [];
  }
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const { user, loading } = useAuth();

  useEffect(() => {
    async function fetchRecipesData() {
      const data = await getRecipes();
      setRecipes(data);
    }
    fetchRecipesData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-center mb-4">Daftar Resep</h1>
        {!loading && user && (
          <Link
            href="/add-recipe"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8"
          >
            + Tambah Resep Baru
          </Link>
        )}
      </div>

      <div className="w-full max-w-5xl">
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <Card key={recipe.id}>
                <CardHeader>
                  <CardTitle>{recipe.title}</CardTitle>
                  <CardDescription>{recipe.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Anda bisa menambahkan lebih banyak detail di sini */}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-xl text-gray-500">
              Belum ada resep yang ditambahkan.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Coba tambahkan resep baru melalui aplikasi atau pastikan backend
              berjalan.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
