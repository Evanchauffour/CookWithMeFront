import Link from 'next/link';
import React from 'react'

interface RecipeItemProps {
  recipe: Recipe;
  index: number;
  isEdition?: boolean;
  openEditModal?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function RecipeItem({ recipe, index, isEdition, openEditModal }: RecipeItemProps) {
  return (
  <Link href={`/recipe/${recipe.id}`}>
    <div className="rounded-lg pb-4 h-fit" key={`${recipe.id}-${index}`}>
      <div className="aspect-square bg-blue-200 rounded-lg"></div>
      <h3 className="text-xl font-medium text-black">{recipe.name}</h3>
      <div className="w-full flex items-center justify-between text-black">
        <p className="text-opacity-50 text-sm">{recipe.nbReviews} avis</p>
        <p className="text-opacity-50 text-sm">{recipe.nbLikes} ❤️</p>
        {isEdition && <button className='p-2 bg-green-600 rounded text-white' onClick={openEditModal}>Modifier</button>}
      </div>
    </div>
  </Link>
  )
}
