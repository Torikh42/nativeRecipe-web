"use client";

import AddRecipeForm from "@/components/AddRecipeForm";

export default function AddRecipePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-24">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <AddRecipeForm />
      </div>
    </main>
  );
}
