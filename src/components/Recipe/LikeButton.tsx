"use client"

import React from 'react'
import Button from '../ui/Button'
import { likeRecipe } from '@/apiServices/userLike'
import Like from '../Icons/Like'
import { useRouter } from 'next/navigation'
import { useUserSession } from '@/hook/useUserSession'

interface LikeButtonProps {
  recipeId: number;
  isLiked: boolean;
}

export default function LikeButton({ recipeId, isLiked }: LikeButtonProps) {
  const { user } = useUserSession();
  const router = useRouter();
  const handleLikeRecipe = async () => {
    if(!user) {
      router.push('/login');
    } else {
      try {
        await likeRecipe({ recipeId: `${recipeId}` })
        router.refresh();
      } catch (error) {
        console.error("Erreur lors du like de la recette :", error);
        
      }
    }
  }

  return (
    <Button className='w-fit mx-auto' click={handleLikeRecipe}>
      <Like className={`${isLiked && 'fill-red-500 stroke-red-500'}`}/>
    </Button>
  )
}
