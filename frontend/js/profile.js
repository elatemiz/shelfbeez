
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
const modalTitle = document.querySelector(
    "#add-book-modal h2"
);

addBookButton.addEventListener("click", function(){
     
    editingBookId = null;

    modalTitle.textContent = "Add a Book";
    submitBookButton.textContent = "Add Book";

    // Show the book search section in Add Book mode.
    bookSelectionSection.style.display = "block";

    addBookModal.style.display = "flex";
});

cancelBookButton.addEventListener("click", function(){
    addBookModal.style.display = "none";

});

const addBookForm = document.querySelector("#add-book-form");

const bookSearchInput = document.querySelector("#book-search-input"); //The text the user enters to search for books
const bookSearchResults = document.querySelector("#book-search-results"); //where books from the API will be displayed

const searchBooksButton = document.querySelector("#search-books-btn");

const selectedBookContainer = document.querySelector("#selected-book"); //where information about the selected book will be displayed

const selectedBookInfo = document.querySelector("#selected-book-info"); 

let selectedBook = null; //Temporarily stores the information of the book selected by the user

const editBookInfo = document.querySelector("#edit-book-info");
const editBookCover = document.querySelector("#edit-book-cover");
const editBookTitle = document.querySelector("#edit-book-title");
const editBookAuthor = document.querySelector("#edit-book-author");

const bookStatusInput = document.querySelector("#book-status");
const bookRatingInput = document.querySelector("#book-rating");

const bookModal = document.querySelector("#add-book-modal");
const bookSelectionSection = document.querySelector("#book-selection-section");

const statusInput = document.querySelector("#book-status");
const ratingInput = document.querySelector("#book-rating");



const submitBookButton = document.querySelector("#add-book-form button[type='submit']");

//note: async and await allow us to wait for the API request to complete.

async function searchBooks(){
    const query = bookSearchInput.value.trim();

    //Prevent empty searches
    if(query === "") {
        bookSearchResults.textContent = "Please enter a book title or author.";
        return;
    }

    bookSearchResults.textContent = "Searching...";

    //notes: fetch() sends a request to the Open Library API.
    //encodeURIComponent(query) makes the search text URL-safe.
   

    try {
        const response = await fetch( 
            `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=8`
        );

        if(!response.ok) {
            throw new Error("Failed to fetch books.");
        }

        const data = await response.json(); ////response.json() converts the API response into a JavaScript object.

        console.log("Open Library response:", data);
        console.log("HTTP status:", response.status);
        
        //Clear search results
        bookSearchResults.innerHTML = "";

        if (data.docs.length === 0) {
            bookSearchResults.textContent = "No books found.";
            return;
        }
        
        //Display the first 8 results on the screen
        data.docs.forEach(function(book) {
            const result = document.createElement("div");
            result.classList.add("book-search-result");

            const coverImage = document.createElement("img");

            coverImage.alt = book.title;

            if ( book.cover_i) { //book cover id
                coverImage.src = 
                `https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`;
            } else {
                coverImage.src = "assets/images/bookcover_placeholder.jpg";
            }
        
            const title = document.createElement("p");
            title.textContent = book.title;

            const author = document.createElement("p");
            author.textContent = book.author_name
            ? book.author_name[0]
            : "Unknown Author";

            result.appendChild(coverImage);
            result.appendChild(title);
            result.appendChild(author);

            result.addEventListener("click", function() {
                selectedBook = { //temporarily stores the information of the clicked book
                    id: book.key,
                    title: book.title,
                    author: book.author_name
                        ? book.author_name[0]
                        : "Unknown Author",
                    cover: book.cover_i || null
                };
            
                selectedBookInfo.innerHTML = "";
            
                const selectedCover = document.createElement("img");
                selectedCover.src = selectedBook.cover
                    ? `https://covers.openlibrary.org/b/id/${selectedBook.cover}-M.jpg`
                    : "assets/images/bookcover_placeholder.jpg";
                selectedCover.alt = selectedBook.title;
            
                const selectedTitle = document.createElement("p");
                selectedTitle.textContent = selectedBook.title;
            
                const selectedAuthor = document.createElement("p");
                selectedAuthor.textContent = selectedBook.author;
            
                selectedBookInfo.appendChild(selectedCover);
                selectedBookInfo.appendChild(selectedTitle);
                selectedBookInfo.appendChild(selectedAuthor);
            
                selectedBookContainer.hidden = false;
            
                bookSearchResults.innerHTML = "";
            });

            bookSearchResults.appendChild(result);
        });

    } catch (error) {
        console.error("Book search error:", error);
        bookSearchResults.textContent =
            "Something went wrong. Please try again.";
    }
}

searchBooksButton.addEventListener("click", searchBooks);



addBookForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const status = bookStatusInput.value;
    const rating = Number(bookRatingInput.value);

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
        console.error("No logged-in user found.");
        return;
    }

    const user = JSON.parse(storedUser);

    if (!user.books) {
        user.books = [];
    }

    if (editingBookId === null) {

        // ADD BOOK: A book must be selected first.
        if (!selectedBook) {
            bookSearchResults.textContent =
                "Please search for and select a book first.";
            return;
        }

        // Prevent adding the same Open Library work twice.
        const alreadyExists = user.books.some(function(book) {
            return book.id === selectedBook.id;
        });

        if (alreadyExists) {
            bookSearchResults.textContent =
                "This book is already in your library.";
            return;
        }

        const book = {
            id: selectedBook.id, //We preserve the Open Library ID of the book. This allows us to check if the same work is attempted to be added a second time.
            title: selectedBook.title,
            author: selectedBook.author,
            cover: selectedBook.cover, //saving the cover ID. renderBooks() can generate the actual cover image using this ID.
            status: status,
            rating: rating
        };

        user.books.push(book);

        console.log("Book added:", book);

    } else {

        // EDIT BOOK: Only update the user's status and rating.
        const bookToEdit = user.books.find(function(book) {
            return book.id === editingBookId;
        });

        if (bookToEdit) {
            bookToEdit.status = status;
            bookToEdit.rating = rating;

            console.log("Book updated:", bookToEdit);
        }

        editingBookId = null;
    }

    // Save the updated library.
    localStorage.setItem("user", JSON.stringify(user));

    addBookModal.style.display = "none";

    renderBooks();

    booksCount.textContent = user.books.length;

    // Reset the selection for the next addition.
    selectedBook = null;
    bookSearchInput.value = "";
    bookSearchResults.innerHTML = "";
    selectedBookInfo.innerHTML = "";
    selectedBookContainer.hidden = true;

    submitBookButton.textContent = "Add Book";
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

            modalTitle.textContent = "Edit Book";

            // Hide book search while editing.
            bookSelectionSection.style.display = "none";

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




         


