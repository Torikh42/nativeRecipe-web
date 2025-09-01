"use client";

import { useEffect, useState } from "react";
import { Recipe } from "@/types";
import RecipeCard from "./RecipeCard";

async function getRecipes(): Promise<Recipe[]> {
  try {
    const res = await fetch("http://localhost:3001/api/recipes", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Gagal mengambil data resep dari backend");
    }

    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default function RecipeList() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipesData() {
      setIsLoading(true);
      const data = await getRecipes();
      setRecipes(data);
      setIsLoading(false);
    }
    fetchRecipesData();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-gray-500">Memuat resep...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-500">
            Belum ada resep yang ditambahkan.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Coba tambahkan resep baru atau pastikan backend berjalan.
          </p>
        </div>
      )}
    </div>
  );
}
