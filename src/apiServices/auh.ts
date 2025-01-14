import { NextResponse } from "next/server";

export async function login(email: string, password: string): Promise<string> {
  try {
      const response = await fetch('http://localhost:8000/api/login_check', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: email, password }),
          credentials: 'include',
      });

      if (response.status === 204) {
          return 'Connexion réussie';
      }

      if (!response.ok) {
          const error = await response.json();
          if (error.message === "Invalid credentials.") {
              throw new Error("Email ou mot de passe incorrect");
          } else {
              throw new Error("Erreur inconnue");
          }
      }

      // Lire le JSON uniquement si ce n'est pas un 204
      const { message } = await response.json();
      return message || 'Connexion réussie';
  } catch (error: any) {
      throw new Error(error.message || 'Une erreur s\'est produite');
  }
}

export async function signup(lastName: string, firstName: string, email: string, password: string) {
  try {
      const response = await fetch('http://127.0.0.1:8000/api/signup', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ lastName, firstName, email, password }),
      });

      if (response.status === 204) {
        return 'Connexion réussie';
      }

      if (!response.ok) {
          const error = await response.json();
          if (error.message === "Invalid credentials.") {
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
    const response = NextResponse.json({ message: "Déconnexion réussie" });
    response.cookies.set("token", "", { expires: new Date(0) });
    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur lors de la déconnexion" },
      { status: 500 }
    );
  }
}
