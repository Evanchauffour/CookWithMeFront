export const likeRecipe = async (data: any) => {
  try {
      console.log('data', data);
      const response = await fetch('http://localhost:8000/api/user_likes/toggle', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/ld+json',
          },
          body: JSON.stringify(data),
          credentials: 'include',

      });

      if (!response.ok) {
          throw new Error(`Erreur lors du like de la recette: ${response.statusText}`);
      }

      const responseData = await response.json();
      return responseData;
  } catch (error) {
      console.error('Erreur lors du like de la recette :', error);
      throw error;
  }
};

export const getUserLikes = async (token: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/user_likes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
  
      console.log('Response:', response);
  
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des recettes likés');
      }
  
      const data = await response.json();
      console.log('Data:', data);
  
      return { success: true, data };
    } catch (error) {
      console.error(error);
      return { success: false, error: error.message };
    }
  };
  