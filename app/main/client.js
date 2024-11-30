import * as elements from "./elements.js";
import { SleepNote } from "./sleepNote.js";
import { loginUri } from "/utils/appUris.js";
import { setCookie } from "/utils/cookies.js";
import { currentDay, weekNotes, drawPlot, drawSleepNote, setCurrentDay } from "./draw.js";
import { refresh } from "/crud/auth.js";
import { getUser } from "/crud/users.js";
import { getSleepGoal, updateSleepGoal, createSleepGoal } from "/crud/goals.js";
import { getSleepNote, updateSleepNote, createSleepNote } from "/crud/notes.js";


init();


async function init() {
    await tryGetUserInfo();
    await tryGetSleepGoal();
    await updateWeekSleepNotes();
    drawPlot();
    drawSleepNote();
    elements.datePicker.value = currentDay;
}


elements.goalButton.addEventListener("click", goalButtonClick);
elements.noteButton.addEventListener("click", noteButtonClick);
elements.dateButton.addEventListener("click", dateButtonClick);


async function dateButtonClick(event) {    
    event.preventDefault();
    if (elements.datePicker.value === currentDay)
        return;

    setCurrentDay(elements.datePicker.value);
    await updateWeekSleepNotes();
    drawPlot();
    drawSleepNote();
}


async function noteButtonClick(event) {
    event.preventDefault();
    if (weekNotes[currentDay])
        await tryUpdateSleepNote();
    else
        await tryCreateSleepNote();
}


async function goalButtonClick(event) {
    event.preventDefault();
    await tryUpdateSleepGoal();
}


async function refresh_tokens() {
    try {
        const responseData = await refresh()

        setCookie("access_token", responseData.access_token, 1);
        setCookie("refresh_token", responseData.refresh_token, 180);
    } catch (error) {
        return false;
    } 

    return true;
}


async function tryGetUserInfo(tries = 3) {
    if (tries <= 0) {
        document.body.innerHTML = '<h1>Internal Server Error</h1>';
    }

    try {
        const responseData = await getUser();
        elements.username.textContent = responseData.username;
        elements.displayName.textContent = responseData.display_name;
    } catch (error) {
        if (error.code === 401) {
            let refreshed = await refresh_tokens();
            if (!refreshed)
                window.location.href = loginUri;
            else
                await tryGetUserInfo(tries - 1);
        } else {
            document.body.innerHTML = `<h1>Error: ${error.message}</h1>`;
        }        
    }
}


async function tryGetSleepGoal(tries = 3) {
    if (tries <= 0) {
        document.body.innerHTML = '<h1>Internal Server Error</h1>';
    }

    try {
        const responseData = await getSleepGoal();
        elements.goalStart.value = responseData.sleep_start;
        elements.goalEnd.value = responseData.sleep_end;
        elements.goalButton.textContent = "Edit goal";
    } catch (error) {
        if (error.code === 401) {
            let refreshed = await refresh_tokens();
            if (!refreshed)
                window.location.href = loginUri;
            else
                await tryGetSleepGoal(tries - 1);
        } else if (error.code === 404) {
            elements.goalStart.value = '22:00';
            elements.goalEnd.value = '06:00';
            elements.goalButton.textContent = "Add goal";
        } else {
            document.body.innerHTML = `<h1>Error: ${error.message}</h1>`;
        }
    }
}

async function tryUpdateSleepNote(tries = 3) {
    if (tries <= 0) {
        document.body.innerHTML = '<h1>Internal Server Error</h1>';
    }

    try {
        await updateSleepNote(currentDay, elements.noteStart.value, elements.noteEnd.value, elements.currentRating || null, elements.noteComment.value);
        elements.noteButton.textContent = "Edit note";
        elements.errorDiv.textContent = "Note succesfuly edited";
        weekNotes[currentDay] = new SleepNote(
            currentDay,
            elements.noteStart.value, 
            elements.noteEnd.value, 
            elements.currentRating || null, 
            elements.noteComment.value
        );
        drawPlot();
    } catch (error) {
        if (error.code === 401) {
            let refreshed = await refresh_tokens();
            if (!refreshed)
                window.location.href = loginUri;
            else
                await tryUpdateSleepNote(tries - 1);
        } else {
            document.body.innerHTML = `<h1>Error: ${error.message}</h1>`;
        }
    }
}


async function tryCreateSleepNote(tries = 3) {
    if (tries <= 0) {
        document.body.innerHTML = '<h1>Internal Server Error</h1>';
    }

    try {
        await createSleepNote(currentDay, elements.noteStart.value, elements.noteEnd.value, elements.currentRating || null, elements.noteComment.value);
        elements.noteButton.textContent = "Edit note";
        elements.errorDiv.textContent = "Note succesfuly created";
        weekNotes[currentDay] = new SleepNote(
            currentDay,
            elements.noteStart.value, 
            elements.noteEnd.value, 
            elements.currentRating || null, 
            elements.noteComment.value
        );
        drawPlot();
    } catch (error) {
        if (error.code === 401) {
            let refreshed = await refresh_tokens();
            if (!refreshed)
                window.location.href = loginUri;
            else
                await tryCreateSleepNote(tries - 1);
        } else {
            document.body.innerHTML = `<h1>Error: ${error.message}</h1>`;
        }
    }
}


async function tryUpdateSleepGoal(tries = 3) {
    if (tries <= 0) {
        document.body.innerHTML = '<h1>Internal Server Error</h1>';
    }

    try {
        await updateSleepGoal(elements.goalStart.value, elements.goalEnd.value);
        elements.goalButton.textContent = "Edit goal";
        elements.errorDiv.textContent = "Goal succesfuly edited";
    } catch (error) {
        if (error.code === 401) {
            let refreshed = await refresh_tokens();
            if (!refreshed)
                window.location.href = loginUri;
            else
                await tryUpdateSleepGoal(tries - 1);
        } else if (error.code === 404) {
            await tryCreateSleepGoal();
        } else {
            document.body.innerHTML = `<h1>Error: ${error.message}</h1>`;
        }
    }
}

async function tryCreateSleepGoal(tries = 3) {
    if (tries <= 0) {
        document.body.innerHTML = '<h1>Internal Server Error</h1>';
    }

    try {
        await createSleepGoal(elements.goalStart.value, elements.goalEnd.value);
        elements.goalButton.textContent = "Edit goal";
        elements.errorDiv.textContent = "Goal succesfuly created";
    } catch (error) {
        if (error.code === 401) {
            let refreshed = await refresh_tokens();
            if (!refreshed)
                window.location.href = loginUri;
            else
                await tryCreateSleepGoal(tries - 1);
        } else {
            document.body.innerHTML = `<h1>Error: ${error.message}</h1>`;
        }
    }
}


async function tryGetSleepNote(date, tries = 3) {
    try {
        const note = await getSleepNote(date);
        return new SleepNote(
            date,
            note.sleep_start,
            note.sleep_end,
            note.rating ,
            note.comment
        );
    } catch (error) {
        if (error.code === 401) {
            let refreshed = await refresh_tokens();
            if (!refreshed)
                window.location.href = loginUri;
            else
                tryGetSleepNote(date, tries - 1);
        } else if (error.code === 404) {
            return null;
        } else {
            document.body.innerHTML = `<h1>Error: ${error.message}</h1>`;
        }
    }
}

async function updateWeekSleepNotes() {
    Object.keys(weekNotes).forEach(key => delete weekNotes[key]);

    let start = new Date(currentDay);

    for (let i = 6; i >= 0; i--) {
        const date = new Date(start);
        date.setDate(start.getDate() - i);
        const formattedDate = date.toISOString().split('T')[0];

        let note = await tryGetSleepNote(formattedDate);
        weekNotes[formattedDate] = note;
    }
}
