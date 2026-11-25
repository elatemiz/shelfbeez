
const form = document.querySelector(".register-form");


const nameInput = document.querySelector("#name");
const usernameInput = document.querySelector("#username");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirm-password");

const usernameError = document.querySelector("#username-error");
const emailError = document.querySelector("#email-error");
const passwordError = document.querySelector("#password-error");
const confirmPasswordError = document.querySelector("#confirm-password-error");

form.addEventListener("submit", async function(event){
      
    event.preventDefault();

    const name = nameInput.value.trim();
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    let isValid = true;

    // Clear previous errors
    
    clearError(usernameInput, usernameError);
    clearError(emailInput, emailError);
    clearError(passwordInput, passwordError);
    clearError(confirmPasswordInput, confirmPasswordError);
   
    //Username validation
    if(username === ""){
        
        showError(
            usernameInput,
            usernameError,
            "Username is required"
        );

        isValid = false;
    }

    //email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(email === ""){
        
        showError(
            emailInput,
            emailError,
            "Email is required"
        );

        isValid = false;

    } else if(!emailPattern.test(email)){
        
        showError(
            emailInput,
            emailError,
            "Invalid email"
        );

        isValid = false;
    }

    //password validation

    if(password.length < 8){
        
        showError(
            passwordInput,
            passwordError,
            "Password must be minimum 8 characters"
        );

        isValid = false;
    }
       
    //confirmed password
    if(password !== confirmPassword){
        
        showError(
            confirmPasswordInput,
            confirmPasswordError,
            "Passwords do not match"
        );

        isValid = false;
    }

    if (isValid) {
        try {
            // Send registration data to the backend.
            const response = await fetch( 
                //frontend now sends requests to the backend's Register endpoint
                "http://localhost:3000/api/auth/register",
                {
                    method: "POST",
    
                    headers: {
                        "Content-Type": "application/json"
                    },
                    
                    //Convert the JavaScript object to JSON format and send it to the backend
                    body: JSON.stringify({
                        name: name,
                        username: username,
                        email: email,
                        password: password
                    })
                }
            );
    
            // Read the server response.
            const data = await response.json();
    
            // Handle registration errors.
            if (!response.ok) {
                alert(data.message);
                return;
            }
    
            // Store the registration success message.
            sessionStorage.setItem(
                "registerSuccess",
                "Account created successfully! Please sign in."
            );
    
            // Redirect to the login page.
            window.location.href = "login.html";
    
        } catch (error) {
            console.error("Registration error:", error);
    
            alert("Unable to connect to the server. Please try again.");
        }
    }

});