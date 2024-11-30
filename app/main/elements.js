// Header
export const username = document.getElementById('username')
export const displayName = document.getElementById('displayName')
export const errorDiv = document.getElementById('errorDiv');
// Plot container
export const plot = document.getElementById('plot');
// Date container
export const datePicker = document.getElementById('datePicker');
export const dateButton = document.getElementById('setDateButton');
// Sleep note container
export const noteStart = document.getElementById('noteSleepStart');
export const noteEnd = document.getElementById('noteSleepEnd');
export const sleepDurationText = document.getElementById('sleepDurationText');
export const stars = document.querySelectorAll('.star');
export let currentRating = 0;
export const noteComment = document.getElementById('noteComment')
export const noteButton = document.getElementById('addNoteButton')
// Sleep goal container
export const goalStart = document.getElementById('goalSleepStart');
export const goalEnd = document.getElementById('goalSleepEnd');
export const goalButton = document.getElementById('setGoalButton');


noteStart.addEventListener('input', updateDuration);
noteEnd.addEventListener('input', updateDuration);


export function setRating(newRating) {
    currentRating = newRating;
}

export function updateDuration() {
    const start = timeToMinutes(noteStart.value);
    let end = timeToMinutes(noteEnd.value);

    if (end <= start) {
        end += 24 * 60;
    }

    const duration = end - start;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    sleepDurationText.textContent = `${hours} hours ${minutes} minutes`;
}

export function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}


stars.forEach(star => {
    star.addEventListener('click', () => {
        const rating = parseInt(star.getAttribute('data-value'));

        if (currentRating === rating) {
            currentRating = 0;
            updateStars();
        } else {
            currentRating = rating;
            updateStars();
        }
    });
});

export function updateStars() {
    stars.forEach(star => {
        const value = parseInt(star.getAttribute('data-value'));
        if (value <= currentRating) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
}
