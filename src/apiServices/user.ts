const BASE_URL = 'http://localhost:8000/api';

export async function getUser(token: string) {
    const response = await fetch(`${BASE_URL}/user`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch user');
    }
    
    return response.json();
}
