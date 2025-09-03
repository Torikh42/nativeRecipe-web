'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Recipe, Ingredient } from '@/types';

// Define the shape of the recipe with ingredients
type RecipeDetail = Recipe & {
  ingredients: Ingredient[];
};

async function getRecipeDetails(id: string): Promise<RecipeDetail | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Gagal mengambil data resep');
    }
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default function RecipeDetailPage({ params }: { params: { id: string } }) {
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const fetchRecipe = async () => {
        setIsLoading(true);
        const data = await getRecipeDetails(params.id);
        setRecipe(data);
        setIsLoading(false);
      };
      fetchRecipe();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center p-6 md:p-24">
        <p className="text-lg">Memuat resep...</p>
      </main>
    );
  }

  if (!recipe) {
    return (
      <main className="flex min-h-screen flex-col items-center p-6 md:p-24">
        <h1 className="text-2xl font-bold">Resep Tidak Ditemukan</h1>
        <p>Maaf, kami tidak dapat menemukan resep yang Anda cari.</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-6 pt-12 md:p-24">
      <article className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">{recipe.title}</h1>
        <p className="text-center text-gray-500 mb-8">{recipe.description}</p>
        
        {recipe.image_url && (
          <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={recipe.image_url}
              alt={recipe.title}
              layout="fill"
              objectFit="cover"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Bahan-bahan</h2>
            <ul className="space-y-2 list-disc list-inside">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient.id}>
                  <span className="font-semibold">{ingredient.name}</span>: {ingredient.quantity}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Instruksi</h2>
            <div className="prose max-w-none whitespace-pre-wrap">
              {recipe.instructions}
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
