import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ message: "Déconnexion réussie" });

    response.cookies.set("BEARER", "", { maxAge: 0 });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur lors de la déconnexion", error },
      { status: 500 }
    );
  }
}
