export async function getRecipesByCategory(categoryId: number, page: number) {
    try {
        const response = await fetch(`http://localhost:8000/api/recipes?page=${page}&category=${categoryId}`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('response', response);


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
        console.log(data)

        return {
            success: true,
            data: data
        }

    } catch (error) {
        console.error('Erreur lors de la récupération des recettes :', error);
    }
}

export async function getMostLikedRecipes() {
    try {
        const response = await fetch(`http://localhost:8000/api/top-liked-recipes`, {
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || (`Failed to fetch most liked recipes`));
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

export async function searchRecipes(query: string, page: number = 1) {
    try {
        const response = await fetch(`http://localhost:8000/api/recipes?name=${query}&page=${page}`, {
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || (`Failed to search recipes with query ${query}`));
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

export async function getRecipeById(recipeId: number, cookieHeader: string) {

    try {
        const response = await fetch(`http://localhost:8000/api/recipes/${recipeId}`, {
            credentials: 'include',
            headers: {
                Authorization: `Bearer ${cookieHeader}`,
            },
        });

        console.log('response', response);


        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `Failed to get recipe with id ${recipeId}`);
        }

        const data = await response.json();

        return {
            success: true,
            data,
        };
    } catch (error) {
        console.error('Erreur lors de la récupération de la recette :', error);
        return { success: false, data: null };
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
        return responseData['@id']; // Retourne les données de la recette créée
    } catch (error) {
        console.error('Erreur lors de la création de la recette :', error);
        throw error;
    }
};
export const createRecipeIngredient = async (recipeData: any) => {
    try {
        console.log('recipeData', recipeData);
        const response = await fetch('http://localhost:8000/api/recipe_ingredients', {
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
export const getRecipeIngredientByRecipe = async (recipeData: any) => {
    try {
        console.log('recipeData', recipeData);
        const response = await fetch(`http://localhost:8000/api/recipe_ingredients?recipe=${recipeData.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/ld+json',
            },
            credentials: 'include',

        });

        // Vérifier si la réponse est OK (status 200-299)
        if (!response.ok) {
            throw new Error(`Erreur lors de la création de la recette: ${response.statusText}`);
        }

        const responseData = await response.json();
        return responseData.member; // Retourne les données de la recette créée
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
export const deleteRecipeIngredient = async (id: any) => {
    try {
        console.log('id recipe', id);
        const response = await fetch(`http://localhost:8000/api/recipe_ingredients?recipe=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/ld+json',
            },
            credentials: 'include',

        });

        // Vérifier si la réponse est OK (status 200-299)
        if (!response.ok) {
            throw new Error(`Erreur lors de la création de la recette: ${response.statusText}`);
        }

        const responseData = await response.json();
        return responseData.member; // Retourne les données de la recette créée
    } catch (error) {
        console.error('Erreur lors de la création de la recette :', error);
        throw error;
    }
};
export const createRecipeImage = async (image: any) => {
    try {
        console.log('recipeData', image);

        // Crée un FormData pour envoyer les fichiers
        const formData = new FormData();
        formData.append('file', image.file); // Ajouter le fichier à envoyer
        formData.append('recipe', `"${image.recipe}"`); // ID de la recette ou URL complète

        // Effectuer la requête
        const response = await fetch('http://localhost:8000/api/recipe_images', {
            method: 'POST',
            body: formData,  // Envoyer les données sous forme de FormData
            credentials: 'include',
            // Pas besoin de définir le Content-Type ici !
        });

        if (!response.ok) {
            throw new Error(`Erreur lors de la création de l'image de recette: ${response.statusText}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Erreur lors de la création de l\'image de recette:', error);
        throw error;
    }
};




