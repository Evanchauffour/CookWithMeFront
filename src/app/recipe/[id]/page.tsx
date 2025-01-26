import { cookies } from 'next/headers';
import { getRecipeById } from '@/apiServices/recipes';
import React from 'react';
import LikeButton from '@/components/Recipe/LikeButton';
import ImgSlider from '@/components/Recipe/ImgSlider';

export default async function Page({ params }: { params: { id: string } }) {
  const recipeId = (await params).id

 const cookieStore = await cookies()
  const token = cookieStore.get('BEARER')

  let recipe = null;
  try {
    const response = await getRecipeById(parseInt(recipeId, 10), token?.value.toString() || '');
    if (!response.success) {
      throw new Error('Erreur lors de la récupération de la recette');
    } else {
      recipe = response.data; 
      console.log(recipe);
    }
  
  } catch (error) {
    console.error('Erreur lors de la récupération des recettes :', error);
  }


  if (!recipe) {
    return (
      <div className="w-[800px] mx-auto mt-8">
        <p>Erreur lors de la récupération de la recette. Veuillez réessayer plus tard.</p>
      </div>
    );
  }

  return (
    <div className="w-[600px] mx-auto mt-8">
      <div className='flex flex-col items-left gap-4'>
        <h1 className='text-4xl font-medium'>{recipe.name}</h1>
        <div className='flex items-center justify-between w-full'>
          <p className="text-opacity-50 text-sm">{recipe.nbLikes} ❤️</p>
        </div>
        <div className='aspect-square w-full rounded-lg overflow-hidden'>
          <ImgSlider recipe={recipe}/>
        </div>
        <LikeButton recipeId={recipe.id} isLiked={recipe.isLikedByCurrentUser}/>
        <ul className='flex flex-col gap-6'>
          {recipe.steps.map((step) => (
            <li key={step.id} className='flex flex-col'>
              <h3 className='text-xl font-medium'>{step.title}</h3>
              <p className='text-base'>{step.content}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
