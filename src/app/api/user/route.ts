// app/api/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/apiServices/user';

export async function GET(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    }

    try {
        const user = await getUser(token);
        return NextResponse.json(user);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur :', error);
        return NextResponse.json({ message: 'Erreur interne' }, { status: 500 });
    }
}
