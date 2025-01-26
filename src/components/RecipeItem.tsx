import Link from 'next/link';
import React from 'react'
import Edit from './Icons/Edit';
import Delete from './Icons/Delete';
import Image from 'next/image';

interface RecipeItemProps {
  recipe: Recipe;
  index: number;
  isEdition?: boolean;
  isAdmin?: boolean;
  openEditModal?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function RecipeItem({ recipe, index, isEdition, openEditModal, isAdmin }: RecipeItemProps) {
  return (
  <Link href={`/recipe/${recipe.id}`}>
    <div className="rounded-lg pb-4 h-fit" key={`${recipe.id}-${index}`}>
      <div className="relative aspect-square bg-blue-200 rounded-lg overflow-hidden">
        {recipe.recipeImages?.length > 0 && recipe.recipeImages[0]?.filePath && (
          <Image
            src={`http://localhost:8000/uploads/recipes/${recipe.recipeImages[0].filePath}`}
            alt={recipe.name}
            layout="fill"
            className="size-full"
          />
        )}     
      </div>
      <h3 className="text-xl font-medium text-black">{recipe.name}</h3>
      <div className="w-full flex items-center justify-between text-black">
        <p className="text-opacity-50 text-sm">{recipe.nbLikes} ❤️</p>
        {isEdition && <button onClick={openEditModal} className='p-2 rounded-full hover:bg-blue-200 transition-all'><Edit className='size-5'/></button>}
        {isAdmin && <button onClick={openEditModal} className='p-2 rounded-full hover:bg-blue-200 transition-all'><Delete className='size-5'/></button>}
      </div>
    </div>
  </Link>
  )
}
