export function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = date.toUTCString();

    document.cookie = `${name}=${value};expires=${expires};path=/`;
}

export function getCookie(name) {
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieValues = decodedCookie.split(';');

    for (let i = 0; i < cookieValues.length; i++) {
        let cookie = cookieValues[i].trim();
        let filter = `${name}=`;
        if (cookie.indexOf(filter) === 0) {
            return cookie.substring(name.length + 1);
        }
    }

    return "";
}
