
const profileName = document.querySelector("#profile-name");
const profileUsername = document.querySelector("#profile-username");

const storedUser = localStorage.getItem("user");
const user = JSON.parse(storedUser);

profileName.textContent = user.name;
profileUsername.textContent = `@${user.username}`;

const booksCount = document.querySelector("#books-count");

const storedBooks = localStorage.getItem("books");
const books = JSON.parse(storedBooks) || [];

booksCount.textContent = books.length;


