'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import EditRecipeForm from '@/components/EditRecipeForm';
import { Recipe, Ingredient } from '@/types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type RecipeDetail = Recipe & {
  ingredients: Ingredient[];
};

async function getRecipeDetails(id: string): Promise<RecipeDetail | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes/${id}`);
    if (!res.ok) {
      throw new Error('Gagal mengambil data resep');
    }
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default function EditRecipePage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const id = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (id) {
      getRecipeDetails(id).then((data) => {
        setRecipe(data);
        setIsLoading(false);
      });
    }
  }, [id]);

  useEffect(() => {
    if (!isLoading && !isAuthLoading) {
      if (!user) {
        toast.error('Anda harus login untuk mengedit resep.');
        router.push('/login');
      } else if (recipe && user.id !== recipe.owner_id) {
        toast.error('Anda tidak memiliki izin untuk mengedit resep ini.');
        router.push(`/recipe/${id}`);
      } else if (recipe) {
        setIsAuthorized(true);
      }
    }
  }, [user, recipe, isLoading, isAuthLoading, id, router]);

  if (isLoading || isAuthLoading || !isAuthorized) {
    return (
      <main className="flex min-h-screen flex-col items-center p-24">
        <p>Memuat dan memverifikasi...</p>
      </main>
    );
  }

  if (!recipe) {
    return (
      <main className="flex min-h-screen flex-col items-center p-24">
        <h1>Resep tidak ditemukan</h1>
      </main>
    );
  }

  return <EditRecipeForm recipe={recipe} />;
}
