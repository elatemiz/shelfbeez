
const profileName = document.querySelector("#profile-name");
const profileUsername = document.querySelector("#profile-username");
const booksCount = document.querySelector("#books-count");

const storedUser = localStorage.getItem("user");
const user = JSON.parse(storedUser);

profileName.textContent = user.name;
profileUsername.textContent = `@${user.username}`;

const books = user.books || [];

booksCount.textContent = books.length;


const addBookButton = document.querySelector("#open-add-book-btn");
const addBookModal = document.querySelector("#add-book-modal");
const cancelBookButton = document.querySelector("#cancel-book-btn");

addBookButton.addEventListener("click", function(){
     addBookModal.style.display = "flex";
});

cancelBookButton.addEventListener("click", function(){
      addBookModal.style.display = "none";

});

const addBookForm = document.querySelector("#add-book-form");

const bookTitleInput = document.querySelector("#book-title");
const bookAuthorInput = document.querySelector("#book-author");
const bookCoverInput = document.querySelector("#book-cover");
const bookStatusInput = document.querySelector("#book-status");
const bookRatingInput = document.querySelector("#book-rating");

addBookForm.addEventListener("submit", function(event){
     event.preventDefault();

    //get input values:

    const title = bookTitleInput.value.trim();
    const author = bookAuthorInput.value.trim();
    const cover = bookCoverInput.value.trim();
    const status = bookStatusInput.value;
    const rating = bookRatingInput.value;

    //book object:

    const book = {
        id: Date.now(),
        title: title,
        author: author,
        cover: cover,
        status: status,
        rating: Number(rating)
    };

    console.log(book);
});

