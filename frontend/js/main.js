
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

        const storedUser = localStorage.getItem("user");
        const user = JSON.parse(storedUser);

        console.log("user:", user);
        console.log("username:", user.username);

        navActions.innerHTML = `
        <span class="nav-username">${user.username}</span>
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
