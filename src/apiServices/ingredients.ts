

export async function getIngredients() {
    try {
        const response = await fetch(`http://localhost:8000/api/ingredients`, {
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
    }
}
export async function postRecipeIngredients() {
    try {
        const response = await fetch(`http://localhost:8000/api/recipe_ingredients`, {
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
    }
}
