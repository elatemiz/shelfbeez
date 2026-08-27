
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

    emailError.textContent = "";
    passwordError.textContent = "";

    emailInput.classList.remove("error");
    passwordInput.classList.remove("error");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(email === ""){

        emailError.textContent = "Email is required";
        emailInput.classList.add("error");
        
        isValid = false;

    }else if(!emailPattern.test(email)){

        emailError.textContent = "Invalid email";
        emailInput.classList.add("error");

        isValid = false;
    }

    if(password === ""){

        passwordError.textContent = "Password is required";
        passwordInput.classList.add("error");

        isValid = false;

    }else if(password.length < 8){

        passwordError.textContent = "Password must be minimum 8 characters";
        passwordInput.classList.add("error");

        isValid = false;
    }

    if(isValid){
        console.log("Login form is valid");
    }


});