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
      const response = await fetch(`http://localhost:8000/api/recipes?user=${userId}`, {
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
