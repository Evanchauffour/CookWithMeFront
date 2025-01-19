"use client";

import { searchRecipes } from '@/apiServices/recipes';
import RecipeItem from '@/components/RecipeItem';
import React, { useState } from 'react'

export default function Page() {

  const [searchResults, setSearchResults] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  
    try {
      if (query.trim() !== '') {
        const response = await searchRecipes(encodeURIComponent(searchQuery));
        setSearchResults(response?.data.member);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche des recettes :', error);
    }
  };
  return (
    <div className='w-[800px] mx-auto'>
      <div className="border px-4 py-2 rounded-full w-full focus-within:border-blue-500">
        <input
          type="text"
          placeholder="Rechercher une recette"
          className="focus:outline-none text-black w-full"
          onChange={handleSearch}
          value={searchQuery}
        />
      </div>
        <div className="grid grid-cols-3 gap-4 mt-8">
          {searchResults.map((recipe, index) => (
            <RecipeItem key={recipe.id} recipe={recipe} index={index} isAdmin/>
          ))}
        </div>
    </div>
  )
}
