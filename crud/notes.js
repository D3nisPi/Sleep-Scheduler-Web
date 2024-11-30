import { HttpError } from "/utils/errors.js";
import { parseResponseError } from "/utils/errorHandlers.js";
import { getCookie } from "/utils/cookies.js";
import { notesUri } from "/utils/uris.js";


export async function getSleepNote(noteDate) {
    let token = getCookie("access_token");
    let uri = `${notesUri}?note_date=${noteDate}`;

    const response = await fetch(uri, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new HttpError(parseResponseError(response.status, error), response.status);
    }

    return response.json();
}


export async function createSleepNote(noteDate, sleepStart, sleepEnd, rating, comment) {
    let token = getCookie("access_token")

    const response = await fetch(notesUri, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            note_date: noteDate,
            sleep_start: sleepStart,
            sleep_end: sleepEnd,
            rating,
            comment,
          }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new HttpError(parseResponseError(response.status, error), response.status);
    }
}


export async function updateSleepNote(noteDate, sleepStart, sleepEnd, rating, comment) {
    let token = getCookie("access_token");
    let uri = `${notesUri}?note_date=${noteDate}`;

    const response = await fetch(uri, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            sleep_start: sleepStart,
            sleep_end: sleepEnd,
            rating,
            comment,
          }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new HttpError(parseResponseError(response.status, error), response.status);
    }
}
