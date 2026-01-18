"use client";

import { useState } from "react";
import { Sparkles, Utensils, ChefHat, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Define the response type (matches backend)
interface AiRecipeResponse {
  title: string;
  description: string;
  ingredients: { name: string; quantity: string }[];
  instructions: string;
}

export default function AiChefPage() {
  const [ingredients, setIngredients] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<AiRecipeResponse | null>(null);
  const router = useRouter();

  const handleGenerate = async () => {
    if (!ingredients.trim()) {
      toast.error("Mohon masukkan daftar bahan terlebih dahulu.");
      return;
    }

    setLoading(true);
    setRecipe(null);

    try {
      // Split ingredients string by lines or commas
      const ingredientsList = ingredients
        .split(/[,\n]/)
        .map((i) => i.trim())
        .filter((i) => i.length > 0);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/ai/generate-recipe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ingredients: ingredientsList }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal membuat resep.");
      }

      setRecipe(data);
      toast.success("Resep berhasil dibuat!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Terjadi kesalahan yang tidak diketahui.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-orange-50/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-full mb-4">
            <Sparkles className="h-8 w-8 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Magic Chef AI</h1>
          <p className="text-lg text-gray-600">
            Tulis bahan yang kamu punya, dan biarkan AI membuatkan resep spesial untukmu!
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="p-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bahan-bahan di Kulkas
            </label>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Contoh: Telur, Bawang Merah, Kecap Manis, Cabai..."
              className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 bg-gray-50 resize-none"
            />
            
            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`mt-4 w-full flex items-center justify-center py-3 px-6 rounded-xl text-white font-bold text-lg shadow-lg transition-all duration-200 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-600 to-orange-500 hover:scale-[1.02] hover:shadow-orange-200"
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Sedang Meracik Resep...
                </>
              ) : (
                <>
                  <ChefHat className="h-5 w-5 mr-2" />
                  Buat Resep Ajaib
                </>
              )}
            </button>
          </div>
        </div>

        {recipe && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-orange-600 px-8 py-6">
              <h2 className="text-3xl font-bold text-white mb-2">{recipe.title}</h2>
              <p className="text-orange-100 text-lg">{recipe.description}</p>
            </div>
            
            <div className="p-8 grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="flex items-center text-xl font-bold text-gray-900 mb-4">
                  <Utensils className="h-5 w-5 mr-2 text-orange-600" />
                  Bahan-bahan
                </h3>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-start bg-orange-50 p-3 rounded-lg">
                      <div className="h-2 w-2 rounded-full bg-orange-500 mt-2 mr-3 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-gray-900">{ing.name}</span>
                        <span className="text-gray-500 ml-1">({ing.quantity})</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="flex items-center text-xl font-bold text-gray-900 mb-4">
                  <Clock className="h-5 w-5 mr-2 text-orange-600" />
                  Cara Memasak
                </h3>
                <div className="prose prose-orange max-w-none text-gray-700 whitespace-pre-line bg-gray-50 p-6 rounded-xl border border-gray-100">
                  {recipe.instructions}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
