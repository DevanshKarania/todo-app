const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

export async function login(username: string, password: string): Promise<any> {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message);
    }
    return result;
}

export async function register(username: string, password: string): Promise<any> {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })
    });
    
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message);
    }
    return result;
}