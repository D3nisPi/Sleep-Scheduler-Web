import * as elements from "./elements.js";

export let currentDay = getTodaysDate();
export let weekNotes = {};
export let chartObject = null;


export function setCurrentDay(newDay) {
    currentDay = newDay;
}

export function drawSleepNote() {
    const note = weekNotes[currentDay];
    if (note) {
        elements.noteStart.value = note.sleepStart;
        elements.noteEnd.value = note.sleepEnd;
        elements.setRating(note.rating ?? 0);      
        elements.noteComment.value = note.comment;
        elements.noteButton.textContent = "Edit Note";
        elements.updateDuration();
        elements.updateStars();
    }
    else {
        setDefaultSleepNote();
    }
}


function setDefaultSleepNote() {
    elements.noteStart.value = '22:00';
    elements.noteEnd.value = '06:00';
    elements.setRating(0)
    elements.noteComment.value = null;
    elements.noteButton.textContent = "Add Note";
    elements.updateDuration();
    elements.updateStars();
}

function getTodaysDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayDate = `${yyyy}-${mm}-${dd}`;
    return todayDate;
}


export function drawPlot() {
    if (chartObject) {
        chartObject.destroy();
    }

    const labels = Object.keys(weekNotes);
    const durations = Object.values(weekNotes).map(note => note ? getSleepDuration(note) : null);

    const ctx = elements.plot.getContext('2d');
    chartObject = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Sleep time (hours)',
                data: durations,
                backgroundColor: 'rgba(91, 155, 213, 0.3)',
                borderColor: 'rgba(46, 113, 180, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true 
                }
            }
        }
    });
}

function getSleepDuration(sleepNote) {
    const startMinutes = elements.timeToMinutes(sleepNote.sleepStart);
    const endMinutes = elements.timeToMinutes(sleepNote.sleepEnd);

    const durationMinutes = endMinutes >= startMinutes
        ? endMinutes - startMinutes
        : 1440 - startMinutes + endMinutes;

    return durationMinutes / 60;
}
