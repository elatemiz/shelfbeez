
let editingBookId = null;

const profileName = document.querySelector("#profile-name");
const profileUsername = document.querySelector("#profile-username");
const booksCount = document.querySelector("#books-count");

const storedUser = localStorage.getItem("user");
const user = storedUser ? JSON.parse(storedUser) : null;

if (user) {
    profileName.textContent = user.name;
    profileUsername.textContent = `@${user.username}`;

    const books = user.books || [];
    booksCount.textContent = books.length;
} else {
    console.log("No logged-in user found.");
}


const addBookButton = document.querySelector("#open-add-book-btn");
const addBookModal = document.querySelector("#add-book-modal");
const cancelBookButton = document.querySelector("#cancel-book-btn");
const deleteBookButton = document.querySelector("#delete-book-btn");
const modalTitle = document.querySelector(
    "#add-book-modal h2"
);

addBookButton.addEventListener("click", function(){

    window.location.href = "books.html";
     
});

cancelBookButton.addEventListener("click", function(){
    addBookModal.style.display = "none";

});

deleteBookButton.addEventListener("click", function(){
    const storedUser = localStorage.getItem("user");

    if(!storedUser || !editingBookId) { ////editingBookId: finds the book that is open in the modal.
        return;
    }

    const user = JSON.parse(storedUser);


    //only removes that book from the user.books list
    user.books = user.books.filter(function(book) { 
        return book.id !== editingBookId; 
    });

    localStorage.setItem("user", JSON.stringify(user));

    addBookModal.style.display = "none";

    editingBookId = null;

    renderBooks();
    booksCount.textContent = user.books.length; //updating the number of books

    console.log("Book deleted successfully.");
});

const addBookForm = document.querySelector("#add-book-form");

const editBookInfo = document.querySelector("#edit-book-info");
const editBookCover = document.querySelector("#edit-book-cover");
const editBookTitle = document.querySelector("#edit-book-title");
const editBookAuthor = document.querySelector("#edit-book-author");


const statusInput = document.querySelector("#book-status");
const ratingInput = document.querySelector("#book-rating");



const submitBookButton = document.querySelector("#add-book-form button[type='submit']");


addBookForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const status = statusInput.value;
    const rating = Number(ratingInput.value);

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
        console.error("No logged-in user found.");
        return;
    }

    const user = JSON.parse(storedUser);

    const bookToEdit = user.books?.find(function(book) {
        return book.id === editingBookId;
    });

    if (!bookToEdit) {
        console.error("Book to edit was not found.");
        return;
    }

    // Update the existing book.
    bookToEdit.status = status;
    bookToEdit.rating = rating;

    // Save the updated library.
    localStorage.setItem("user", JSON.stringify(user));

    // Close the modal.
    addBookModal.style.display = "none";

    // Refresh the bookshelf and book count.
    renderBooks();
    booksCount.textContent = user.books.length;

    // Reset the editing state.
    editingBookId = null;
    editBookInfo.hidden = true;
    submitBookButton.textContent = "Save Changes";

    console.log("Book updated:", bookToEdit);
});


function renderBooks() {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    const bookshelves = document.querySelectorAll(".books");

    // Clear all shelf containers first.
    bookshelves.forEach(function(shelf) {
        shelf.innerHTML = "";
    });

    if (!user || !user.books) {
        return;
    }

    // Place each book into a shelf container.
    user.books.forEach(function(book, index) {
        
        console.log("Book title:", book.title);
        console.log("Cover value:", book.cover);
        console.log("Cover type:", typeof book.cover);

        const bookElement = document.createElement("div");
        bookElement.classList.add("book");
       
        // Book cover
        const coverImage = document.createElement("img");
        coverImage.classList.add("book-cover");
        coverImage.alt = book.title;
        
        // Open Library cover ID, URL, or fallback image

        if (book.cover) {
            coverImage.src = typeof book.cover === "number"
                ? `https://covers.openlibrary.org/b/id/${book.cover}-M.jpg`
                : book.cover;
        } else {
            coverImage.src = "assets/images/bookcover_placeholder.jpg";
        }

        coverImage.onerror = function() {
            console.log("Cover failed to load:", book.title);
            console.log("Attempted URL:", coverImage.src);
        
            coverImage.onerror = null;
            coverImage.src = "assets/images/bookcover_placeholder.jpg";
        };
      
     
        // Book title
        const titleElement = document.createElement("p");
        titleElement.classList.add("book-title");
        titleElement.textContent = book.title;
        
        
        bookElement.appendChild(coverImage);
        bookElement.appendChild(titleElement);

        bookElement.addEventListener("click", function() {
            editingBookId = book.id;

            modalTitle.textContent = "Edit Book";

            //show the selected book's information
            editBookInfo.hidden = false;

            editBookTitle.textContent = book.title;
            editBookAuthor.textContent = book.author || "Unknown Author";

            //display the book cover:
            if(book.cover){
                editBookCover.src = typeof book.cover === "number"
                ? `https://covers.openlibrary.org/b/id/${book.cover}-M.jpg`
                : book.cover;
            } else {
                editBookCover.src = "assets/images/bookcover_placeholder.jpg";
            }

            editBookCover.onerror = function() {
                editBookCover.onerror = null;
                editBookCover.src = "assets/images/bookcover_placeholder.jpg";
            };

            // Load the current book's values.
            statusInput.value = book.status;
            ratingInput.value = book.rating;

            // Open the modal in edit mode.
            addBookModal.style.display = "flex";
            submitBookButton.textContent = "Save Changes";

        });

    
        // Choose a shelf based on the book's index.
        const shelfIndex = index % bookshelves.length;
        bookshelves[shelfIndex].appendChild(bookElement);
    });
}


renderBooks();




         


