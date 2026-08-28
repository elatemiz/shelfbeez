
const form = document.querySelector(".login-form");

const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

const emailError = document.querySelector("#email-error");
const passwordError = document.querySelector("#password-error");

form.addEventListener("submit", function(event){
     
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    let isValid = true;

    clearError(emailInput, emailError);
    clearError(passwordInput, passwordError);

    

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(email === ""){

        showError(
            emailInput,
            emailError,
            "Email is required"
        );

        
        isValid = false;

    }else if(!emailPattern.test(email)){

        showError(
            emailInput, 
            emailError,
            "Invalid email"
        );

        isValid = false;
    }

    if(password === ""){

        showError(
            passwordInput,
            passwordError,
            "Password is required"
        );

        isValid = false;

    }else if(password.length < 8){

        showError(
            passwordInput,
            passwordError,
            "Password must be minimum 8 characters"
        );

        isValid = false;
    }

    if(isValid){
        
        const storedUser = localStorage.getItem("user");

        const user = JSON.parse(storedUser);

        if(email === user.email && password === user.password){

            console.log("Login successful");
        } else {

            console.log("Invalid email or password");

        }

    }

});