
const form = document.querySelector(".login-form");


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

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    let isValid = true;

    // Clear previous errors

    usernameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    confirmPasswordError.textContent = "";

    usernameInput.classList.remove("error");
    emailInput.classList.remove("error");
    passwordInput.classList.remove("error");
    confirmPasswordInput.classList.remove("error");
   
    //Username validation
    if(username === ""){
        usernameError.textContent = "Username is required";
        usernameInput.classList.add("error");

        isValid = false;
    }

    //email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(email === ""){
        emailError.textContent = "Email is required";
        emailInput.classList.add("error");

        isValid = false;

    } else if(!emailPattern.test(email)){
        emailError.textContent = "Invalid email";
        emailInput.classList.add("error");

        isValid = false;
    }

    //password validation

    if(password.length < 8){
        passwordError.textContent = "Password must be minimum 8 characters";
        passwordInput.classList.add("error");

        isValid = false;
    }
       
    //confirmed password
    if(password !== confirmPassword){
        confirmPasswordError.textContent = "Passwords do not match"; 
        confirmPasswordInput.classList.add("error");

        isValid = false;
    }

    if(isValid){
        console.log("Form is valid");
    }

});