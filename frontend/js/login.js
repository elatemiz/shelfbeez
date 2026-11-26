
const form = document.querySelector(".login-form");

const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

const emailError = document.querySelector("#email-error");
const passwordError = document.querySelector("#password-error");

const registerSuccessMessage = document.querySelector(
    "#register-success-message"
);

const registerSuccess = sessionStorage.getItem("registerSuccess");


if (registerSuccess) {
    registerSuccessMessage.textContent = registerSuccess;
    registerSuccessMessage.classList.add("success-message");

    sessionStorage.removeItem("registerSuccess");
}

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const identifier = emailInput.value.trim();
    const password = passwordInput.value;

    let isValid = true;

    clearError(emailInput, emailError);
    clearError(passwordInput, passwordError);

    // Validate email or username.
    if (identifier === "") {

        showError(
            emailInput,
            emailError,
            "Email or username is required"
        );

        isValid = false;
    }

    // Validate password.
    if (password === "") {

        showError(
            passwordInput,
            passwordError,
            "Password is required"
        );

        isValid = false;

    } else if (password.length < 8) {

        showError(
            passwordInput,
            passwordError,
            "Password must be minimum 8 characters"
        );

        isValid = false;
    }

    // Send login request to the backend.
    if (isValid) {

        try {

            const response = await fetch(
                "http://localhost:3000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        identifier: identifier,
                        password: password
                    })
                }
            );

            const data = await response.json();

            // Handle login errors.
            if (!response.ok) {

                showError(
                    emailInput,
                    emailError,
                    data.message
                );

                return;
            }

            // Store the logged-in user's information.
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            localStorage.setItem("isLoggedIn", "true");

            console.log("Login successful!");

            window.location.href = "index.html";

        } catch (error) {

            console.error("Login error:", error);

            showError(
                emailInput,
                emailError,
                "Unable to connect to the server. Please try again."
            );
        }
    }

});