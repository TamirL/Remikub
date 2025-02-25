export function getClientCookiesMap(): Map<string, string> {
    const cookies = document.cookie.split('; ');
    const cookiesMap = new Map<string, string>();

    for (const cookie of cookies) {
        const [key, value] = cookie.split('=');
        cookiesMap.set(key, value);
    }

    return cookiesMap;
}

type CookieOptions = {
    expires?: string | Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
};

export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
    const { expires, path = '/', domain, secure = true, httpOnly = true, sameSite = 'Strict' } = options;

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=${path}`;

    if (expires) {
        const date = expires instanceof Date ? expires : new Date(expires);
        cookieString += `; expires=${date.toUTCString()}`;
    }

    if (domain) {
        cookieString += `; domain=${domain}`;
    }

    if (secure) {
        cookieString += `; secure`;
    }

    if (httpOnly) {
        cookieString += `; HttpOnly`;
    }

    if (sameSite) {
        cookieString += `; SameSite=${sameSite}`;
    }

    document.cookie = cookieString;
}
