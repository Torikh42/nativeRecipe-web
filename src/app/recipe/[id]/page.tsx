"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Recipe, Ingredient } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {  ChefHat, Users, Edit, Trash2, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type RecipeDetail = Recipe & {
  ingredients: Ingredient[];
};

async function getRecipeDetails(id: string): Promise<RecipeDetail | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/recipes/${id}`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) {
      throw new Error("Gagal mengambil data resep");
    }
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      const fetchRecipe = async () => {
        setIsLoading(true);
        const data = await getRecipeDetails(id);
        setRecipe(data);
        setIsLoading(false);
      };
      fetchRecipe();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!recipe) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/recipes/${recipe.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal menghapus resep");
      }

      toast.success("Resep berhasil dihapus!");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      toast.error(errorMessage);
    }
  };

  const handleUpdate = () => {
    if (!recipe) return;
    router.push(`/recipe/${recipe.id}/edit`);
  };

  const handleBack = () => {
    router.back();
  };

  const isOwner = user && recipe && user.id === recipe.owner_id;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="space-y-6">
            <Skeleton className="h-8 w-32" />
            <Card>
              <CardHeader>
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full rounded-lg" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-32" />
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-4 w-full" />
                      ))}
                    </div>
                  </div>
                  <div className="lg:col-span-2 space-y-4">
                    <Skeleton className="h-6 w-24" />
                    <div className="space-y-2">
                      {[...Array(8)].map((_, i) => (
                        <Skeleton key={i} className="h-4 w-full" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <div className="mb-4">
              <ChefHat className="h-16 w-16 mx-auto text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Resep Tidak Ditemukan</h1>
            <p className="text-gray-600 mb-4">
              Maaf, kami tidak dapat menemukan resep yang Anda cari.
            </p>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6">
          {/* Back Button */}
          <Button
            onClick={handleBack}
            variant="ghost"
            className="mb-4 hover:bg-white/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>

          {/* Recipe Card */}
          <Card className="overflow-hidden shadow-xl">
            {/* Header */}
            <CardHeader className="pb-4">
              <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-start lg:space-y-0">
                <div className="flex-1">
                  <CardTitle className="text-3xl lg:text-4xl font-bold leading-tight mb-3">
                    {recipe.title}
                  </CardTitle>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {recipe.description}
                  </p>
                </div>

                {isOwner && (
                  <div className="flex gap-3 lg:ml-6">
                    <Button
                      onClick={handleUpdate}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Hapus
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-xl">
                            Hapus Resep?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-base">
                            Tindakan ini tidak dapat dibatalkan. Resep `
                            {recipe.title}` akan dihapus secara permanen dari
                            akun Anda.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Hapus Resep
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Recipe Image */}
              {recipe.image_url && (
                <div className="relative w-full h-64 lg:h-96 rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={recipe.image_url}
                    alt={recipe.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform hover:scale-105 duration-300"
                  />
                </div>
              )}

              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Ingredients */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center">
                      <ChefHat className="h-5 w-5 mr-2 text-orange-600" />
                      Bahan-bahan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={ingredient.id} className="flex items-start">
                          <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full text-xs font-semibold flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            {index + 1}
                          </span>
                          <div>
                            <span className="font-medium text-gray-900">
                              {ingredient.name}
                            </span>
                            <span className="text-gray-600 ml-2">
                              {ingredient.quantity}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Instructions */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center">
                      <Users className="h-5 w-5 mr-2 text-blue-600" />
                      Cara Memasak
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-base">
                        {recipe.instructions}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Footer */}
              <Separator className="my-8" />
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-muted-foreground">
                <div>Resep masakan lezat</div>
                {recipe.created_at && (
                  <div>
                    Dibuat pada{" "}
                    {new Date(recipe.created_at).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
