import { HttpError } from "/utils/errors.js";
import { parseResponseError } from "/utils/errorHandlers.js";
import { getCookie } from "/utils/cookies.js";
import { usersUri } from "/utils/uris.js";


export async function createUser(username, displayName, password) {
    const response = await fetch(usersUri, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            username, 
            display_name: displayName, 
            password 
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new HttpError(parseResponseError(response.status, error), response.status);
    }
}


export async function getUser() {
    let token = getCookie("access_token")

    const response = await fetch(usersUri, {
        method: "GET",
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
