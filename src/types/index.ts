// Didefinisikan sekali di sini, bisa diekspor ke file lain

export interface Recipe {
  id: number;
  created_at: string;
  owner_id: string;
  title: string;
  description: string;
  instructions: string;
  image_url?: string;
}

export interface Ingredient {
  id: number;
  created_at: string;
  recipe_id: number;
  name: string;
  quantity: string;
}
