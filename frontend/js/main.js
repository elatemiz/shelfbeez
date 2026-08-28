
function showError(input, errorElement, message){
    input.classList.add("error");
    errorElement.textContent = message;
}

function clearError(input, errorElement){
    input.classList.remove("error");
    errorElement.textContent = "";
}

function updateNavbar() {
    const navActions = document.querySelector("#nav-actions");

    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if(isLoggedIn === "true"){
        navActions.innerHTML = `
           <a href="profile.html" class="login-btn">Profile</a>
           <button class="register-btn" id="logout-btn">Logout</button>
    `;

    const logoutButton = document.querySelector("#logout-btn");

    if(logoutButton) {

        logoutButton.addEventListener("click", function() {

        localStorage.removeItem("isLoggedIn");
        window.location.href = "index.html";

        });
      }
   }
}

updateNavbar();
