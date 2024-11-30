import { loginUri } from "/utils/appUris.js";
import { createUser } from "/crud/users.js";


const form = document.getElementById("registerForm");
const errorDiv = document.getElementById("errorDiv");


document.getElementById("loginLink").href = loginUri;
form.addEventListener("submit", registerButtonClick);


async function registerButtonClick(event) {
    event.preventDefault();

    const formData = new FormData(form);
    const username = formData.get("username");
    const displayName = formData.get("display-name")
    const password = formData.get("password");

    try {
        await createUser(username, displayName, password);
        window.location.href = loginUri;
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove("hidden");
    }
}
