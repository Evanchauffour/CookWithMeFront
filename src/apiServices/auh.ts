export async function login(email: string, password: string) {
  try {
      const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
          const error = await response.json();
          console.log("error", error);
          
          if(error.message === "Invalid credentials.") {
            throw new Error("Email ou mot de passe incorrect");
          } else {
            throw new Error("Erreur inconnue");
          }
      }

      const { message } = await response.json();
      return message;
  } catch (error) {
      throw new Error(error.message || 'An error occurred');
  }
}

export async function signup(lastName: string, firstName: string, email: string, password: string) {
  try {
      const response = await fetch('/api/signup', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ lastName, firstName, email, password }),
      });

      if (!response.ok) {
          const error = await response.json();
          console.log("error", error);
          
          if(error.message === "Invalid credentials.") {
            throw new Error("Email ou mot de passe incorrect");
          } else {
            throw new Error("Erreur inconnue");
          }
      }

      const { message } = await response.json();
      return message;
  } catch (error) {
      throw new Error(error.message || 'An error occurred');
  }
}

export async function logout() {
  try {
    const response = await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la déconnexion");
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
