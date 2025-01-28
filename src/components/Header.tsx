'use client';

import { useUserSession } from '@/hook/useUserSession';
import React, { useState } from 'react';
import Button from './ui/Button';
import Link from 'next/link';
import List from './Icons/List';
import Chevron from './Icons/Chevron';
import Like from './Icons/Like';
import { logout } from '@/apiServices/auh';
import { useRouter } from 'next/navigation';
import SearchBar from './SearchBar/SearchBar';

export default function Header() {
    const { user, isLoading, refreshUser } = useUserSession();
    const [isHover, setIsHover] = useState(false);    
    const router = useRouter();

    const handleLogout = async () => {
      const response = await logout();
      if (response.success) {
        router.push('/login');
        await refreshUser();
        setIsHover(false);
      }
    };

    return (
        <header className="w-full flex justify-between items-center px-12 py-6 gap-12 border-b">
            <Link href='/'><h1 className="text-2xl font-bold text-black">CookWithMe</h1></Link>
              <SearchBar />
              <div className="flex items-center gap-1 text-black">
                {isLoading ? 'Chargement...' : (
                user ? (
                  <>
                  <div className='relative' onMouseOver={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
                  <button className='flex items-center gap-2'>
                    <span>{user?.firstName} {user?.lastName}</span>
                    <Chevron className={`size-6 transition-all text-slate-700 ${isHover ? 'rotate-90' : 'rotate-0'}`}/>
                  </button>
                  {isHover && (
                    <div className='absolute right-0 min-w-full w-[200px] pt-2 z-10'>
                      <div className='p-2 bg-white shadow-lg shadow-slate-400 rounded-lg flex flex-col'>
                        <ul className='text-black flex flex-col mb-2'> 
                          <li className='w-full py-2 px-4 hover:bg-blue-200 rounded-lg'>
                            <Link href='/myrecipe' className='flex items-center gap-2'><List className='size-4'/> Mes recettes</Link>
                          </li>                 
                          <li className='w-full py-2 px-4 hover:bg-blue-200 rounded-lg'>
                          <Link href='/mylikes' className='flex items-center gap-2'><Like className='size-4'/> Mes likes</Link>
                          </li>
                        </ul>
                        <Button label='Se déconnecter' click={() => handleLogout()}/>
                      </div>
                    </div>
                  )}
                  </div>
                </>
                ) : (
                    <Button>
                      <Link href='/login'>Se connecter</Link>
                    </Button>
                )
                  )}
            </div>
        </header>
    );
}
