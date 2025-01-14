import { NextResponse } from "next/server";

export async function getCategories() {
    try {
        const response = await fetch(`http://localhost:8000/api/categories`, {
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || 'Failed to fetch categories');
        }

        const data = await response.json();

        return {
          success: true,
          data: data
        }

    } catch (error) {
        console.error('Erreur lors de la récupération des catégories :', error);

        return NextResponse.json({ message: 'Erreur interne' }, { status: 500 });
    }
}
