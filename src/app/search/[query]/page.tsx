"use client";

import { searchRecipes } from '@/apiServices/recipes';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function Page() {
  const params = useParams<{ query: string }>();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [pages, setPages] = useState(1);

  const handleSearch = async (query: string) => {
    try {
      const response = await searchRecipes(query, pages);
      if (response && response.success && response.data.member.length > 0) {
        setRecipes((prevRecipes) => [...prevRecipes, ...response.data.member]);
        setPages((prevPages) => prevPages + 1);
        setHasMore(response.data.member.length > 0);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des recettes :', error);
    }
  };

  useEffect(() => {
    if (params.query) {
      setPages(1);
      setRecipes([]);
      handleSearch(params.query);
    }
  }, [params.query]);

  return (
    <section className="w-[800px] mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-2 text-black">
        Résultats de la recherche : {`"${decodeURIComponent(params.query)}"`}
      </h2>
      <div
        id="scrollableDiv"
        style={{
          height: 600,
          overflow: 'auto',
        }}
      >
        <InfiniteScroll
          className="grid grid-cols-3 gap-4"
          dataLength={recipes.length}
          next={() => handleSearch(params.query)}
          hasMore={hasMore}
          loader={<div className="text-center">Chargement...</div>}
          scrollableTarget="scrollableDiv"
        >
          {recipes.map((recipe, index) => (
            <div className="rounded-lg pb-4 h-fit" key={`${recipe.id}-${index}`}>
              <div className="aspect-square bg-blue-200 rounded-lg"></div>
              <h3 className="text-xl font-medium text-black">{recipe.name}</h3>
              <div className="w-full flex items-center justify-between text-black">
                <p className="text-opacity-50 text-sm">{recipe.nbReviews} avis</p>
                <p className="text-opacity-50 text-sm">{recipe.nbLikes} ❤️</p>
              </div>
            </div>
          ))}
        </InfiniteScroll>
        {!hasMore && recipes.length > 0 && (
          <p className="text-center text-gray-500 mt-4">
            Toutes les recettes ont été chargées.
          </p>
        )}
      </div>
    </section>
  );
}
