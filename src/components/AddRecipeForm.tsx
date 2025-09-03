"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Ingredient } from "../types";
import {
  ChefHat,
  Plus,
  Trash2,
  Upload,
  Camera,
  Utensils,
} from "lucide-react";

type IngredientForm = Pick<Ingredient, "name" | "quantity">;

export default function AddRecipeForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState<IngredientForm[]>([
    { name: "", quantity: "" },
  ]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, session, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleIngredientChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const values = [...ingredients];
    if (event.target.name === "name") {
      values[index].name = event.target.value;
    } else {
      values[index].quantity = event.target.value;
    }
    setIngredients(values);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "" }]);
  };

  const removeIngredient = (index: number) => {
    const values = [...ingredients];
    values.splice(index, 1);
    setIngredients(values);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isIngredientsEmpty = ingredients.some(
      (ing) => ing.name.trim() === "" || ing.quantity.trim() === ""
    );
    if (isIngredientsEmpty) {
      toast.error("Nama dan jumlah bahan tidak boleh kosong.");
      return;
    }

    setIsLoading(true);

    if (!session?.access_token) {
      toast.error("Anda harus login untuk menambah resep.");
      setIsLoading(false);
      return;
    }

    const payload = {
      title,
      description,
      instructions,
      ingredients,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Gagal mengirim data. Pastikan backend berjalan."
        );
      }

      toast.success("Resep berhasil ditambahkan!");
      router.push("/");
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-orange-100">
          <div className="flex items-center space-x-3">
            <ChefHat className="h-6 w-6 text-primary animate-pulse" />
            <h1 className="text-2xl font-bold text-foreground">
              Memuat atau Mengarahkan...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-4 rounded-full shadow-lg">
              <ChefHat className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Tambah Resep Baru
          </h1>
          <p className="text-muted-foreground text-lg">
            Bagikan kreasi kuliner Anda dengan komunitas
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Info Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Utensils className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  Informasi Dasar
                </h2>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-sm font-medium text-foreground"
                >
                  Nama Resep *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan nama resep yang menarik..."
                  required
                  className="h-12 border-2 border-orange-100 focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-foreground"
                >
                  Deskripsi Singkat *
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ceritakan sedikit tentang resep ini..."
                  required
                  rows={3}
                  className="border-2 border-orange-100 focus:border-primary transition-colors resize-none"
                />
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Camera className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  Foto Resep
                </h2>
              </div>

              <div className="border-2 border-dashed border-orange-200 rounded-xl p-6 hover:border-primary transition-colors">
                {previewUrl ? (
                  <div className="space-y-4">
                    <div className="relative w-full h-64 rounded-lg overflow-hidden">
                      <Image
                        src={previewUrl}
                        alt="Pratinjau Gambar"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                    <div className="flex justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setImageFile(null);
                          setPreviewUrl(null);
                        }}
                        className="border-orange-200 text-orange-600 hover:bg-orange-50"
                      >
                        Ganti Foto
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-12 w-12 text-orange-300 mx-auto mb-4" />
                    <Label htmlFor="image" className="cursor-pointer">
                      <div className="text-lg font-medium text-foreground mb-2">
                        Upload Foto Resep
                      </div>
                      <div className="text-sm text-muted-foreground mb-4">
                        PNG atau JPEG, maksimal 5MB
                      </div>
                    </Label>
                    <Input
                      type="file"
                      id="image"
                      accept="image/png, image/jpeg"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Ingredients Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-secondary p-2 rounded-lg">
                    <Utensils className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Bahan-bahan
                  </h2>
                </div>
                <Button
                  type="button"
                  onClick={addIngredient}
                  className="bg-secondary hover:bg-secondary/90 text-white shadow-md"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Bahan
                </Button>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-xl p-6 space-y-4">
                {ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-4 shadow-sm border border-green-100"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-accent p-2 rounded-full">
                        <span className="text-sm font-semibold text-foreground">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 grid md:grid-cols-2 gap-3">
                        <Input
                          type="text"
                          name="name"
                          placeholder="Nama bahan (cth: Tepung terigu)"
                          value={ingredient.name}
                          onChange={(e) => handleIngredientChange(index, e)}
                          className="border-2 border-yellow-100 focus:border-accent transition-colors"
                        />
                        <Input
                          type="text"
                          name="quantity"
                          placeholder="Jumlah (cth: 200 gr)"
                          value={ingredient.quantity}
                          onChange={(e) => handleIngredientChange(index, e)}
                          className="border-2 border-yellow-100 focus:border-accent transition-colors"
                        />
                      </div>
                      {ingredients.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeIngredient(index)}
                          className="border-red-200 text-red-600 hover:bg-red-50 p-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="bg-primary p-2 rounded-lg">
                  <ChefHat className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  Cara Memasak
                </h2>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6">
                <Textarea
                  id="instructions"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Tulis langkah-langkah memasak secara detail...&#10;&#10;1. Siapkan semua bahan&#10;2. Panaskan minyak dalam wajan&#10;3. ..."
                  required
                  rows={8}
                  className="border-2 border-orange-100 focus:border-primary transition-colors resize-none bg-white"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-orange-100">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-12 bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 text-white shadow-lg transform hover:scale-[1.02] transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Menyimpan Resep...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <ChefHat className="h-5 w-5" />
                    <span>Simpan Resep</span>
                  </div>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 sm:flex-none h-12 border-2 border-orange-200 text-orange-600 hover:bg-orange-50 px-8"
              >
                Batal
              </Button>
            </div>
          </form>
        </div>

        {/* Footer Tips */}
        <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-orange-100">
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center space-x-2">
            <span>💡</span>
            <span>Tips untuk Resep yang Menarik</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="space-y-2">
              <p>• Gunakan foto yang terang dan menarik</p>
              <p>• Tulis langkah-langkah yang jelas dan detail</p>
            </div>
            <div className="space-y-2">
              <p>• Cantumkan takaran bahan dengan tepat</p>
              <p>• Bagikan tips khusus untuk hasil terbaik</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
