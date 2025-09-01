'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import RecipeList from '@/components/RecipeList';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between lg:flex mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-left mb-4 lg:mb-0">Daftar Resep</h1>
        {!loading && user && (
          <Button asChild>
            <Link href="/add-recipe">+ Tambah Resep Baru</Link>
          </Button>
        )}
      </div>

      <RecipeList />
      
    </main>
  );
}
