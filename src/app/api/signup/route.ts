import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { name, email, password } = await req.json();

    try {
        const response = await fetch('http://localhost:8000/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json({ message: error.message }, { status: response.status });
        }

        const { token } = await response.json();

        const responseToClient = NextResponse.json({ message: 'Signup successful' });
        responseToClient.cookies.set('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60,
        });

        return responseToClient;
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
}
