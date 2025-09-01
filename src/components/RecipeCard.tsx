"use client";

import Link from "next/link";
import Image from "next/image";
import { Recipe } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChefHat, Heart } from "lucide-react";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipe/${recipe.id}`}>
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-orange-100 hover:border-primary/30 bg-gradient-to-b from-white to-orange-50/30">
        {recipe.image_url ? (
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={recipe.image_url}
              alt={recipe.title}
              layout="fill"
              objectFit="cover"
              className="group-hover:scale-110 transition-transform duration-300"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <Heart className="h-4 w-4 text-red-500" />
            </div>

            <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
              Resep
            </div>
          </div>
        ) : (
          <div className="relative w-full h-48 bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center">
            <div className="text-center">
              <ChefHat className="h-12 w-12 text-orange-300 mx-auto mb-2" />
              <span className="text-orange-400 text-sm font-medium">
                Tidak ada foto
              </span>
            </div>
          </div>
        )}

        <CardHeader className="pb-3">
          <CardTitle className="truncate text-foreground group-hover:text-primary transition-colors duration-300 text-lg font-bold">
            {recipe.title}
          </CardTitle>
          <CardDescription className="line-clamp-2 text-muted-foreground leading-relaxed">
            {recipe.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-grow flex items-end pt-4">
          <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center">
                <ChefHat className="h-4 w-4 text-orange-400" />
              </div>
              <span className="font-medium text-foreground/80">
                {recipe.User?.full_name || "Resep Pengguna"}
              </span>
            </div>
            <div className="h-1 w-8 bg-gradient-to-r from-primary to-accent rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
