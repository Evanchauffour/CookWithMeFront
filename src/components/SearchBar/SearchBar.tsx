import { searchRecipes } from '@/apiServices/recipes'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import Button from '../ui/Button'
import RecipeItemSearch from './RecipeItemSearch'

export default function SearchBar() {

  const [searchResults, setSearchResults] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const searchBarRef = useRef(null);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  
    try {
      if (query.trim() !== '') {
        const response = await searchRecipes(encodeURIComponent(query));
        setSearchResults(response?.data.member.slice(0, 3));
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche des recettes :', error);
    }
  };  

  const handleClickOutside = (event) => {
    if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
      setSearchResults([]);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchBarRef} className="flex-1 relative">
      <div className="border px-4 py-2 rounded-full w-full focus-within:border-blue-500">
        <input
          type="text"
          placeholder="Rechercher une recette"
          className="focus:outline-none text-black w-full"
          onChange={handleSearch}
          value={searchQuery}
        />
      </div>
      {searchQuery.length > 0 && (
      <div className='absolute translate-y-4 w-full h-auto bg-white shadow-lg shadow-slate-400 rounded-lg z-10'>
        {searchResults.length > 0 ? (
          <div className='flex flex-col items-center gap-4 p-4'>
            <ul className='text-black flex flex-row w-full flex-wrap justify-center gap-6'> 
              {searchResults.map((recipe) => (
                <li className="rounded-lg h-fit" key={`${recipe.id}`} onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }}>
                  <RecipeItemSearch recipe={recipe} />
                </li>
              ))}
            </ul>
            <Button click={() => {
              setSearchQuery('');
              setSearchResults([]);
            }}>
              <Link href={`/search/${searchQuery}`}>Voir tout</Link>
            </Button>
          </div>
        ) : (
          <div className='flex flex-col items-center gap-4 p-4'>
            <p className='text-black'>Aucun résultat</p>
          </div>
        )}
      </div>
      )}
    </div>
  )
}
