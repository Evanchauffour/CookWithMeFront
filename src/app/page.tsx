"use client"

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import { useEffect, useState } from 'react';
import { getCategories } from '@/apiServices/categories';
import { Category } from '@/types/types';

const items = [
  { id: 1, title: 'Pizza au feu de bois', nbReviews: 8, nbLikes: 12 },
  { id: 2, title: 'Pizza au feu de bois', nbReviews: 8, nbLikes: 12 },
  { id: 3, title: 'Pizza au feu de bois', nbReviews: 8, nbLikes: 12 },
  { id: 4, title: 'Pizza au feu de bois', nbReviews: 8, nbLikes: 12 },
  { id: 5, title: 'Pizza au feu de bois', nbReviews: 8, nbLikes: 12 },
];

export default function Home() {
  const [filter, setFilter] = useState<number>(1);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    const response = await getCategories();
    setCategories(response.member);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if(!categories) {
    return <p>Loading...</p>
  }

  return (
    <div className='w-full'>
      <div className='w-[800px] mx-auto flex flex-col gap-8'>
        <section className='w-full'>
          <h2 className='text-2xl font-bold mb-2 text-black'>Les plus populaires</h2>
          <Swiper
          slidesPerView={3}
          spaceBetween={30}
          autoplay={{
            delay: 2500,
            disableOnInteraction: true,
          }}
          modules={[Autoplay]}
          key={items.length}
        >
          {items.map((item) => (
            <SwiperSlide className='rounded-lg pb-4' key={item.id}>
              <div className='aspect-square bg-blue-200 rounded-lg'></div>
              <h3 className='text-xl font-medium text-black'>{item.title}</h3>
              <div className='w-full flex items-center justify-between text-black'>
                <p className='text-opacity-50 text-sm'>{item.nbReviews} avis</p>
                <p className='text-opacity-50 text-sm'>{item.nbLikes} ❤️</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        </section>
        <section className='w-full'>
          <h2 className='text-2xl font-bold mb-2 text-black'>Explorez nos catégories</h2>
          <div className='flex gap-3 flex-wrap mb-4'>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`border py-2 px-4 rounded-lg hover:bg-blue-100 ${filter === category.id ? 'bg-blue-100' : ''}`}
              onClick={() => setFilter(category.id)}
            >
              <p className='text-black'>{category.name}</p>
            </button>
          ))}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {items.map((item) => (
              <div className='rounded-lg pb-4' key={item.id}>
                <div className='aspect-square bg-blue-200 rounded-lg'></div>
                <h3 className='text-xl font-medium text-black'>{item.title}</h3>
                <div className='w-full flex items-center justify-between text-black'>
                  <p className='text-opacity-50 text-sm'>{item.nbReviews} avis</p>
                  <p className='text-opacity-50 text-sm'>{item.nbLikes} ❤️</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
