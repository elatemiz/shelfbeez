
const profileUsername = document.querySelector("#profile-username");

const storedUser = localStorage.getItem("user");
const user = JSON.parse(storedUser);

profileUsername.textContent = user.username;

