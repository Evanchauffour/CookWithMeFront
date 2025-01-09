import React from 'react'

export default function Header() {
  return (
    <header className='w-full flex justify-between items-center px-12 py-6 gap-12 border-b'>
      <h1 className='text-2xl font-bold text-black'>CookWithMe</h1>
      <div className='border px-4 py-2 rounded-full flex-1 focus-within:border-blue-500'>
        <input type="text" placeholder="Rechercher une recette" className='focus:outline-none text-black'/>
      </div>
      <div className='flex items-center gap-1 text-black'>
        <p>Nom</p>
        <p>Prénom</p>
      </div>
    </header>
  )
}
