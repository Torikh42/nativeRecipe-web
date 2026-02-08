"use client";

import { useState } from "react";
import { Sparkles, Utensils, ChefHat, Clock } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { experimental_useObject as useObject } from '@ai-sdk/react';

const RecipeSchema = z.object({
  title: z.string(),
  description: z.string(),
  ingredients: z.array(
    z.object({
      name: z.string(),
      quantity: z.string(),
    })
  ),
  instructions: z.string(),
});

export default function AiChefPage() {
  const [activeTab, setActiveTab] = useState<"text" | "image">("text");
  const [ingredients, setIngredients] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { 
    object: textRecipe, 
    submit: submitText, 
    isLoading: isTextLoading,
  } = useObject({
    api: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/ai/generate-recipe`,
    schema: RecipeSchema,
    onError: (error: any) => {
      toast.error(error.message || "Gagal memproses permintaan.");
    },
    onFinish: () => {
      toast.success("Berhasil! Selamat memasak!");
    }
  });

  const { 
    object: imageRecipe, 
    submit: submitImage, 
    isLoading: isImageLoading,
  } = useObject({
    api: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/ai/identify-food`,
    schema: RecipeSchema,
    onError: (error: any) => {
      toast.error(error.message || "Gagal memproses permintaan.");
    },
    onFinish: () => {
      toast.success("Berhasil! Selamat memasak!");
    }
  });

  const loading = isTextLoading || isImageLoading;
  const recipe = activeTab === "text" ? textRecipe : imageRecipe;
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Ukuran gambar maksimal 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (activeTab === "text") {
      if (!ingredients.trim()) {
        toast.error("Mohon masukkan daftar bahan terlebih dahulu.");
        return;
      }
      const ingredientsList = ingredients
        .split(/[,\n]/)
        .map((i) => i.trim())
        .filter((i) => i.length > 0);
      
      submitText({ ingredients: ingredientsList });
    } else {
      if (!selectedImage) {
        toast.error("Mohon upload foto makanan terlebih dahulu.");
        return;
      }
      submitImage({ image: selectedImage });
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
            Punya bahan di kulkas atau foto makanan? Biarkan AI membuatkan resep spesial!
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="border-b border-gray-100 flex">
            <button
              onClick={() => setActiveTab("text")}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === "text"
                  ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50/50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Tulis Bahan
            </button>
            <button
              onClick={() => setActiveTab("image")}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === "image"
                  ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50/50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Upload Foto
            </button>
          </div>

          <div className="p-8">
            {activeTab === "text" ? (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bahan-bahan di Kulkas
                </label>
                <textarea
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="Contoh: Telur, Bawang Merah, Kecap Manis, Cabai..."
                  className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 bg-gray-50 resize-none"
                />
              </>
            ) : (
              <div className="text-center">
                <div 
                  className={`border-2 border-dashed rounded-xl p-8 transition-colors ${
                    selectedImage ? "border-orange-300 bg-orange-50" : "border-gray-300 hover:border-orange-400"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer block w-full h-full">
                    {selectedImage ? (
                      <div className="relative h-48 w-full">
                        <img 
                          src={selectedImage} 
                          alt="Preview" 
                          className="h-full w-full object-contain rounded-lg"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-lg text-white font-medium">
                          Ganti Foto
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6">
                        <div className="bg-orange-100 p-4 rounded-full mb-4">
                          <ChefHat className="h-8 w-8 text-orange-600" />
                        </div>
                        <p className="text-gray-900 font-medium mb-1">
                          Klik untuk upload foto makanan
                        </p>
                        <p className="text-gray-500 text-sm">
                          PNG, JPG, JPEG (Max 5MB)
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            )}
            
            <button
              onClick={handleGenerate}
              disabled={loading || (activeTab === "text" ? !ingredients : !selectedImage)}
              className={`mt-6 w-full flex items-center justify-center py-3 px-6 rounded-xl text-white font-bold text-lg shadow-lg transition-all duration-200 ${
                loading || (activeTab === "text" ? !ingredients : !selectedImage)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-600 to-orange-500 hover:scale-[1.02] hover:shadow-orange-200"
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  {activeTab === "text" ? "Sedang Meracik..." : "Sedang Menganalisa..."}
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  {activeTab === "text" ? "Buat Resep Ajaib" : "Analisa & Buat Resep"}
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
                  {recipe.ingredients?.map((ing : any, idx : any) => (
                    <li key={idx} className="flex items-start bg-orange-50 p-3 rounded-lg">
                      <div className="h-2 w-2 rounded-full bg-orange-500 mt-2 mr-3 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-gray-900">{ing?.name}</span>
                        <span className="text-gray-500 ml-1">({ing?.quantity})</span>
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
