import { HttpError } from "/utils/errors.js";
import { parseResponseError } from "/utils/errorHandlers.js";
import { getCookie } from "/utils/cookies.js";
import { loginUri, refreshUri } from "/utils/uris.js";


export async function login(username, password) {
    const response = await fetch(loginUri, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            username, 
            password 
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new HttpError(parseResponseError(response.status, error), response.status);
    }

    return response.json();
}


export async function refresh() {
    let token = getCookie("refresh_token");

    const response = await fetch(refreshUri, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new HttpError(parseResponseError(response.status, error), response.status);
    }

    return response.json();
}
