import { registerUri, appUri } from "/utils/appUris.js";
import { setCookie } from "/utils/cookies.js";
import { login } from "/crud/auth.js";


const form = document.getElementById("loginForm");
const errorDiv = document.getElementById("errorDiv");


document.getElementById("registerLink").href = registerUri;
form.addEventListener("submit", loginButtonClick);


async function loginButtonClick(event) {
    event.preventDefault();

    const formData = new FormData(form);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
        const responseData = await login(username, password)

        setCookie("access_token", responseData.access_token, 1);
        setCookie("refresh_token", responseData.refresh_token, 180);
        window.location.href = appUri;

    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove("hidden");
    }
}
