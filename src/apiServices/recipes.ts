export async function getRecipesByCategory(categoryId: number) {
    try {
        const response = await fetch(`http://localhost:8000/api/recipes?category=${categoryId}`, {
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || (`Failed to fetch recipes for category ${categoryId}`));
        }

        const data = await response.json();

        return {
            success: true,
            data: data
        }

    } catch (error) {
        console.error('Erreur lors de la récupération des recettes :', error);
    }
}

export async function getRecipesByUser(userId: number) {
    try {
        const response = await fetch(`http://localhost:8000/api/recipes?author=${userId}`, {
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || (`Failed to fetch recipes for user ${userId}`));
        }

        const data = await response.json();

        return {
            success: true,
            data: data
        }

    } catch (error) {
        console.error('Erreur lors de la récupération des recettes :', error);
    }
}
export const createRecipe = async (recipeData: any) => {
    try {
        console.log('recipeData', recipeData);
        const response = await fetch('http://localhost:8000/api/recipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/ld+json',
            },
            body: JSON.stringify(recipeData),
            credentials: 'include',

        });

        // Vérifier si la réponse est OK (status 200-299)
        if (!response.ok) {
            throw new Error(`Erreur lors de la création de la recette: ${response.statusText}`);
        }

        const responseData = await response.json();
        return responseData; // Retourne les données de la recette créée
    } catch (error) {
        console.error('Erreur lors de la création de la recette :', error);
        throw error;
    }
};
export const updateRecipe = async (recipeData: any) => {
    try {
        console.log('recipeData', recipeData);
        const response = await fetch(`http://localhost:8000/api/recipes/${recipeData.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/merge-patch+json',
            },
            body: JSON.stringify(recipeData),
            credentials: 'include',

        });

        // Vérifier si la réponse est OK (status 200-299)
        if (!response.ok) {
            throw new Error(`Erreur lors de la création de la recette: ${response.statusText}`);
        }

        const responseData = await response.json();
        return responseData; // Retourne les données de la recette créée
    } catch (error) {
        console.error('Erreur lors de la création de la recette :', error);
        throw error;
    }
};
