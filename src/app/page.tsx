import RecipeList from "@/components/RecipeList";
import { Recipe } from "@/types";

async function getRecipes(): Promise<Recipe[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Gagal mengambil data resep");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
}

export default async function Home() {
  const recipes = await getRecipes();

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between lg:flex mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-left mb-4 lg:mb-0">
          Daftar Resep
        </h1>
      </div>
      <RecipeList recipes={recipes} />
    </main>
  );
}
