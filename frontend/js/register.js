
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

form.addEventListener("submit", function(event){
      
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

    if(isValid){
        const user = {
            name: name,
            username: username,
            email: email,
            password: password
        };

        localStorage.setItem("user", JSON.stringify(user));

        console.log("user registered successfully");
    }

});