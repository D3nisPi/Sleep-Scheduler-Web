import { HttpError } from "/utils/errors.js";
import { parseResponseError } from "/utils/errorHandlers.js";
import { getCookie } from "/utils/cookies.js";
import { goalsUri } from "/utils/uris.js";


export async function getSleepGoal() {
    let token = getCookie("access_token")

    const response = await fetch(goalsUri, {
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


export async function createSleepGoal(sleepStart, sleepEnd) {
    let token = getCookie("access_token")

    const response = await fetch(goalsUri, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
            sleep_start: sleepStart, 
            sleep_end: sleepEnd 
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new HttpError(parseResponseError(response.status, error), response.status);
    }
}


export async function updateSleepGoal(sleepStart, sleepEnd) {
    let token = getCookie("access_token")

    const response = await fetch(goalsUri, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
            sleep_start: sleepStart, 
            sleep_end: sleepEnd 
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new HttpError(parseResponseError(response.status, error), response.status);
    }
}
