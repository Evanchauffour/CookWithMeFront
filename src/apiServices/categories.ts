import { NextResponse } from "next/server";

export async function getCategories() {
    try {
      const response = await fetch(`http://localhost:8000/api/categories`, {
        credentials: 'include'
      });
    
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch categories');
      }

      return NextResponse.json(await response.json());
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories :', error);
        return NextResponse.json({ message: 'Erreur interne' }, { status: 500 });
    }
}
