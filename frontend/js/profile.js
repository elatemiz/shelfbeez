
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

addBookButton.addEventListener("click", function(){
     
    editingBookId = null;

    submitBookButton.textContent = "Add Book";

    addBookModal.style.display = "flex";
});

cancelBookButton.addEventListener("click", function(){
    addBookModal.style.display = "none";

});

const addBookForm = document.querySelector("#add-book-form");

const bookTitleInput = document.querySelector("#book-title");
const bookAuthorInput = document.querySelector("#book-author");
const bookStatusInput = document.querySelector("#book-status");
const bookRatingInput = document.querySelector("#book-rating");

const bookModal = document.querySelector("#add-book-modal");

const statusInput = document.querySelector("#book-status");
const ratingInput = document.querySelector("#book-rating");

const submitBookButton = document.querySelector("#add-book-form button[type='submit']");

addBookForm.addEventListener("submit", function(event){
     event.preventDefault();

    //get input values:

    const title = bookTitleInput.value.trim();
    const author = bookAuthorInput.value.trim();
    const status = bookStatusInput.value;
    const rating = bookRatingInput.value;


    const storedUser = localStorage.getItem("user");
    const user = JSON.parse(storedUser);

    //check if user has books[] property:
    
    if (!user.books){
        user.books = [];
    }

    if (editingBookId === null){
       
        //ADD BOOK

        const book = {
            id: Date.now(),
            title: title,
            author: author,
            status: status,
            rating: Number(rating)

        };

        user.books.push(book);

        console.log("Book added:", book);

    }else {
         
        //EDIT BOOK

        const bookToEdit = user.books.find(function(book){
            return book.id === editingBookId;
        });

        if (bookToEdit){

            bookToEdit.status = status;
            bookToEdit.rating = Number(rating);

            console.log("Book updated:", bookToEdit);

            renderBooks();
        }

        editingBookId = null;

    }

    localStorage.setItem("user", JSON.stringify(user));

    addBookModal.style.display = "none";

    renderBooks();

    booksCount.textContent = user.books.length;

    
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
        
        // Action buttons
        const actions = document.createElement("div");
        actions.classList.add("book-actions");
        
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        
        actions.appendChild(editButton);
        actions.appendChild(deleteButton);
        
        bookElement.appendChild(coverImage);
        bookElement.appendChild(titleElement);
        bookElement.appendChild(actions);

        
        deleteButton.addEventListener("click", function() {
            user.books = user.books.filter(function(bookItem) {
                return bookItem.id !== book.id;
            });

            localStorage.setItem("user", JSON.stringify(user));
            renderBooks();

            const updatedBooks = user.books || [];
            booksCount.textContent = updatedBooks.length;
        });

        editButton.addEventListener("click", function() {
            editingBookId = book.id;

            statusInput.value = book.status;
            ratingInput.value = book.rating;

            addBookModal.style.display = "flex";
            submitBookButton.textContent = "Save Changes";
        });

    
        // Choose a shelf based on the book's index.
        const shelfIndex = index % bookshelves.length;
        bookshelves[shelfIndex].appendChild(bookElement);
    });
}


renderBooks();




         


