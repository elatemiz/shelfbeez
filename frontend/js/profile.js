
const profileName = document.querySelector("#profile-name");
const profileUsername = document.querySelector("#profile-username");
const booksCount = document.querySelector("#books-count");

const storedUser = localStorage.getItem("user");
const user = JSON.parse(storedUser);

profileName.textContent = user.name;
profileUsername.textContent = `@${user.username}`;

const books = user.books || [];

booksCount.textContent = books.length;


