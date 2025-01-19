import Link from 'next/link';
import React from 'react'

interface RecipeItemSearchProps {
  recipe: Recipe;
}

export default function RecipeItemSearch({ recipe }: RecipeItemSearchProps) {
  return (
    <Link href={`/recipe/${recipe.id}`} className="rounded-lg h-fit">
      <div className="aspect-square bg-blue-200 rounded-lg size-[200px]"></div>
      <h3 className="text-base font-medium text-black">{recipe.name}</h3>
    </Link>
  )
}
