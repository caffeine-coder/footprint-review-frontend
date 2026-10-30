import axios from "axios";

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: "ADMIN" | "EDITOR" | "VIEWER";
}

interface CsrfToken {
    headerName: string;
    token: string;
}

let csrfToken: CsrfToken | null = null;

async function fetchCsrfToken() {
    const response = await axios.get<CsrfToken>("/api/auth/csrf");
    csrfToken = response.data;
}

export async function getCurrentUser() {
    const response = await axios.get<AuthUser>("/api/auth/me");
    await fetchCsrfToken();
    return response.data;
}

export async function login(email: string, password: string) {
    await fetchCsrfToken();

    const form = new URLSearchParams({ email, password });

    await axios.post("/api/auth/login", form, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            [csrfToken!.headerName]: csrfToken!.token
        }
    });

    return getCurrentUser();
}

export async function logout() {
    if (!csrfToken) await fetchCsrfToken();

    await axios.post("/api/auth/logout", null, {
        headers: {
            [csrfToken!.headerName]: csrfToken!.token
        }
    });

    csrfToken = null;
}

export function getCsrfHeaders() {
    if (!csrfToken) throw new Error("CSRF token not available");

    return {
        [csrfToken.headerName]: csrfToken.token
    };
}
