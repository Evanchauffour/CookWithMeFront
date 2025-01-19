import { getUserLikes } from '@/apiServices/userLike';
import RecipeItem from '@/components/RecipeItem';
import { cookies } from 'next/headers';
import React from 'react'

export default async function page() {

  const cookieStore = await cookies()
  const token = cookieStore.get('BEARER')
  let recipes = null;

  try {
    const response = await getUserLikes(token?.value.toString() || '');
    if (!response.success) {
      throw new Error('Erreur lors de la récupération des recettes likés');
    } else {
      recipes = response.data; 
      console.log(recipes);
    }
  
  } catch (error) {
    console.error('Erreur lors de la récupération des recettes :', error);
  }

  return (
    <div className='w-[800px] mx-auto flex flex-col gap-8'>
      <h1 className='text-2xl font-medium'>Mes recettes likés</h1>
      <div className="grid grid-cols-3 gap-4">
        {recipes.map((recipe, index) => (
          <RecipeItem key={recipe.id} recipe={recipe} index={index} />
        ))}
      </div>
    </div>
  )
}
