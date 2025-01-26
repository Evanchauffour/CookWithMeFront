"use client";

import { searchRecipes } from '@/apiServices/recipes';
import RecipeItem from '@/components/RecipeItem';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function Page() {
  const params = useParams<{ query: string }>();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  const fetchRecipes = async (query: string, page: number, isNewSearch: boolean = false) => {
    try {
      setLoading(true);

      const response = await searchRecipes(query, page);
      if (response?.success) {
        const newRecipes = response.data.member;

        setRecipes((prevRecipes) =>
          isNewSearch ? newRecipes : [...prevRecipes, ...newRecipes]
        );
        setHasMore(newRecipes.length > 0);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des recettes :', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.query) {
      setPage(1);
      setHasMore(true);
      fetchRecipes(params.query, 1, true);
    }
  }, [params.query]);

  useEffect(() => {
    if (page > 1) {
      fetchRecipes(params.query, page);
    }
  }, [page]);

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
          next={() => setPage((prevPage) => prevPage + 1)}
          hasMore={hasMore}
          loader={<div className="text-center">Chargement...</div>}
          scrollableTarget="scrollableDiv"
        >
          {recipes.map((recipe, index) => (
            <RecipeItem key={recipe.id} recipe={recipe} index={index} />
          ))}
        </InfiniteScroll>
        {loading && (
          <p className="text-center text-gray-500 mt-4">Chargement des recettes...</p>
        )}
        {!hasMore && recipes.length > 0 && (
          <p className="text-center text-gray-500 mt-4">
            Toutes les recettes ont été chargées.
          </p>
        )}
        {!loading && recipes.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            Aucune recette trouvée pour cette recherche.
          </p>
        )}
      </div>
    </section>
  );
}
