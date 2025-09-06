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
import { Recipe, Ingredient } from "../types";
import { Plus, Trash2, Upload } from "lucide-react";

type IngredientForm = Pick<Ingredient, "name" | "quantity">;

type RecipeDetail = Recipe & {
  ingredients: Ingredient[];
};

interface EditRecipeFormProps {
  recipe: RecipeDetail;
}

export default function EditRecipeForm({ recipe }: EditRecipeFormProps) {
  const [title, setTitle] = useState(recipe.title);
  const [description, setDescription] = useState(recipe.description);
  const [instructions, setInstructions] = useState(recipe.instructions);
  const [ingredients, setIngredients] = useState<IngredientForm[]>(
    recipe.ingredients
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    recipe.image_url || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user, token, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    if (!isAuthLoading && (!user || user.id !== recipe.owner_id)) {
      toast.error("Anda tidak diizinkan untuk mengedit resep ini.");
      router.push(`/recipe/${recipe.id}`);
    }
  }, [user, isAuthLoading, router, recipe]);

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
    if (ingredients.length > 1) {
      const values = [...ingredients];
      values.splice(index, 1);
      setIngredients(values);
    }
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

    setIsSubmitting(true);

    if (!token) {
      toast.error("Sesi tidak valid. Silakan login kembali.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      title,
      description,
      instructions,
      ingredients,
      image_url: previewUrl, // Keep existing image if no new one is uploaded
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/recipes/${recipe.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            "Gagal memperbarui resep. Pastikan backend berjalan."
        );
      }

      toast.success("Resep berhasil diperbarui!");
      router.push(`/recipe/${recipe.id}`);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Terjadi kesalahan yang tidak terduga.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading || !user) {
    return <div>Loading...</div>; // Or a more sophisticated loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Edit Resep</h1>
          <p className="text-gray-600">Perbarui detail resep Anda.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Form sections go here, similar to AddRecipeForm */}
            <div className="space-y-2">
              <Label htmlFor="title">Nama Resep *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi Singkat *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <Label>Foto Resep</Label>
              <div className="border-2 border-dashed rounded-lg p-6">
                {previewUrl ? (
                  <div>
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      width={200}
                      height={200}
                      className="rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setPreviewUrl(null);
                        setImageFile(null);
                      }}
                    >
                      Ganti Foto
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="image" className="cursor-pointer">
                      <Upload className="h-12 w-12 mx-auto" />
                      <div>Upload Foto</div>
                    </Label>
                    <Input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Ingredients Section */}
            <div>
              <Label>Bahan-bahan</Label>
              {ingredients.map((ing, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <Input
                    type="text"
                    placeholder="Nama bahan"
                    name="name"
                    value={ing.name}
                    onChange={(e) => handleIngredientChange(index, e)}
                  />
                  <Input
                    type="text"
                    placeholder="Jumlah"
                    name="quantity"
                    value={ing.quantity}
                    onChange={(e) => handleIngredientChange(index, e)}
                  />
                  {ingredients.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeIngredient(index)}
                    >
                      <Trash2 />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" onClick={addIngredient}>
                <Plus /> Tambah Bahan
              </Button>
            </div>

            {/* Instructions Section */}
            <div className="space-y-2">
              <Label htmlFor="instructions">Cara Memasak *</Label>
              <Textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                required
                rows={8}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Batal
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
