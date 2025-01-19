"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { useEffect, useState } from "react";
import { getCategories } from "@/apiServices/categories";
import { Category } from "@/types/types";
import { getMostLikedRecipes, getRecipesByCategory } from "@/apiServices/recipes";
import InfiniteScroll from "react-infinite-scroll-component";
import RecipeItem from "@/components/RecipeItem";

export default function Home() {
  const [filter, setFilter] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [mostLikedRecipes, setMostLikedRecipes] = useState([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setError(null);
      const response = await getCategories();
      if (response?.success) {
        setCategories(response.data.member);
        setFilter(response.data.member[0]?.id || null);
      } else {
        throw new Error("Structure de réponse inattendue");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  };

  // Fetch recipes by category with pagination
  const fetchCategoryRecipes = async () => {
    if (!filter) return;

    try {
      setLoading(true);
      setError(null);

      const response = await getRecipesByCategory(filter, page);
      if (response?.success) {
        const newRecipes = response.data.member;

        setRecipes((prevRecipes) => [...prevRecipes, ...newRecipes]);
        setHasMore(newRecipes.length > 0); // Stop if no more recipes
      } else {
        throw new Error("Structure de réponse inattendue");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  // Fetch most liked recipes
  const fetchMostLikedRecipes = async () => {
    try {
      setError(null);
      const response = await getMostLikedRecipes();
      if (response?.success) {
        setMostLikedRecipes(response.data);
      } else {
        throw new Error("Structure de réponse inattendue");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  };

  // Initialize categories and most liked recipes
  useEffect(() => {
    fetchMostLikedRecipes();
    fetchCategories();
  }, []);

  // Reset recipes and page on category change
  useEffect(() => {
    if (filter !== null) {
      setRecipes([]);
      setPage(1);
      setHasMore(true);
      fetchCategoryRecipes();
    }
  }, [filter]);

  useEffect(() => {
    fetchCategoryRecipes();
  }, [page]);

  if (error) {
    return <p className="text-red-500">Erreur : {error}</p>;
  }

  return (
    <div className="w-full">
      <div className="w-[800px] mx-auto flex flex-col gap-8">
        {/* Section: Most Liked Recipes */}
        <section className="w-full">
          <h2 className="text-2xl font-bold mb-2 text-black">Les plus populaires</h2>
          <Swiper
            slidesPerView={3}
            spaceBetween={30}
            autoplay={{
              delay: 2500,
              disableOnInteraction: true,
            }}
            modules={[Autoplay]}
            key={mostLikedRecipes.length}
          >
            {mostLikedRecipes.map((item, index) => (
              <SwiperSlide key={item.id}>
                <RecipeItem recipe={item} index={index} />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* Section: Categories and Infinite Scroll */}
        <section className="w-full">
          <h2 className="text-2xl font-bold mb-2 text-black">Explorez nos catégories</h2>
          <div className="flex gap-3 flex-wrap mb-4">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`border py-2 px-4 rounded-lg hover:bg-blue-100 ${
                  filter === category.id ? "bg-blue-100" : ""
                }`}
                onClick={() => setFilter(category.id)}
              >
                <p className="text-black">{category.name}</p>
              </button>
            ))}
          </div>
          <div
            id="scrollableDiv"
            style={{
              height: 600,
              overflow: "auto",
            }}
          >
            <InfiniteScroll
              className="grid grid-cols-3 gap-4"
              dataLength={recipes.length}
              next={() => setPage((prevPage) => prevPage + 1)}
              hasMore={hasMore}
              loader={<h4>Chargement...</h4>}
              scrollableTarget="scrollableDiv"
            >
              {recipes.map((recipe, index) => (
                <RecipeItem key={recipe.id} recipe={recipe} index={index} />
              ))}
            </InfiniteScroll>
          </div>
        </section>
      </div>
    </div>
  );
}
