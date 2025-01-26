"use client"

import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import Image from 'next/image';

interface ImgSliderProps {
  recipe: Recipe;
}

export default function ImgSlider({recipe}: ImgSliderProps) {
  return (
    <Swiper
    slidesPerView={1}
    spaceBetween={0}
    autoplay={{
      delay: 2500,
      disableOnInteraction: true,
    }}
    modules={[Autoplay]}
    key={recipe.id}
    className='size-full'
  >
    {recipe.recipeImages.map((img, index) => (
      <SwiperSlide key={index}>
        <Image
          src={`http://localhost:8000/uploads/recipes/${img.filePath}`}
          alt={recipe.name}
          layout="fill"
          objectFit="cover"
          className="size-full"
        />
      </SwiperSlide>
    ))}
  </Swiper>
  )
}
