export function getClientCookiesMap(): Map<string, string> {
    const cookies = document.cookie.split('; ');
    const cookiesMap = new Map<string, string>();

    for (const cookie of cookies) {
        const [key, value] = cookie.split('=');
        cookiesMap.set(key, value);
    }

    return cookiesMap;
}