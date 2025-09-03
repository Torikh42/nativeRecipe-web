"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import RecipeList from "@/components/RecipeList"; 
import { Recipe } from "@/types"; 

export default function DashboardPage() {
  const { token } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyRecipes = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/recipes/mine`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil resep Anda.");
        }

        const data = await response.json();
        setRecipes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyRecipes();
  }, [token]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Dashboard Resep Saya
      </h1>

      {isLoading && <p>Memuat resep...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!isLoading && !error && recipes.length > 0 && (
        <RecipeList recipes={recipes} />
      )}

      {!isLoading && !error && recipes.length === 0 && (
        <p>Anda belum membuat resep apa pun.</p>
      )}
    </div>
  );
}
