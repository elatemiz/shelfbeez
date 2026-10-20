
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
const closeBookModalButton = document.querySelector("#close-book-modal");
const modalTitle = document.querySelector(
    "#add-book-modal h2"
);

const addBookForm = document.querySelector("#add-book-form");

const editBookInfo = document.querySelector("#edit-book-info");
const editBookCover = document.querySelector("#edit-book-cover");
const editBookTitle = document.querySelector("#edit-book-title");
const editBookAuthor = document.querySelector("#edit-book-author");

const statusInput = document.querySelector("#book-status");
const ratingInput = document.querySelector("#book-rating");

const submitBookButton = document.querySelector("#add-book-form button[type='submit']");

const cancelDeleteButton = document.querySelector("#cancel-delete");
const confirmDeleteButton = document.querySelector("#confirm-delete");

const dialog = document.getElementById("delete-dialog");

const activityList = document.querySelector(".activity-list");


addBookButton.addEventListener("click", function(){

    window.location.href = "books.html";
     
});

closeBookModalButton.addEventListener("click", function(){
    addBookModal.style.display = "none";
    editingBookId = null;
    editBookInfo.hidden = true;
    submitBookButton.textContent = "Save Changes";
});

deleteBookButton.addEventListener("click", function(){
    
    dialog.showModal();

});

cancelDeleteButton.addEventListener("click", function(){
    
    dialog.close();
    
});


confirmDeleteButton.addEventListener("click", function(){
    const storedUser = localStorage.getItem("user");
        if(!storedUser || !editingBookId) { ////editingBookId: finds the book that is open in the modal.
        return;
    }

    const user = JSON.parse(storedUser);

    // Find the book before deleting it.
    const deletedBook = user.books.find(function(book) {
        return book.id === editingBookId;
    });

    // Record the deletion activity.
    if (deletedBook) {
        if (!Array.isArray(user.activities)) {
            user.activities = [];
        }
    
        user.activities.push({
            id: Date.now(),
            type: "deleted",
            bookTitle: deletedBook.title,
            bookCover: deletedBook.cover,
            date: new Date().toISOString()
        });
    }

    //only removes that book from the user.books list
    user.books = user.books.filter(function(book) { 
        return book.id !== editingBookId; 
    });

    // Save the updated user and activity list.
    localStorage.setItem("user", JSON.stringify(user));

    dialog.close();

    addBookModal.style.display = "none";

    editingBookId = null;

    renderBooks();
    booksCount.textContent = user.books.length; //updating the number of books

});
   
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

    // Store the old values before updating.
    const oldStatus = bookToEdit.status;
    const oldRating = Number(bookToEdit.rating) || 0;

    // Update the existing book.
    bookToEdit.status = status;
    bookToEdit.rating = rating;

    
    if (!Array.isArray(user.activities)) {
        user.activities = [];
    }

    // Track status changes.
    if (oldStatus !== status) {
        user.activities.push({
            id: Date.now(),
            type: "status-updated",
            bookTitle: bookToEdit.title,
            bookCover: bookToEdit.cover,
            oldStatus: oldStatus,
            newStatus: status,
            date: new Date().toISOString()
        });
    }

    // Track rating changes.
    if (oldRating !== rating) {
        user.activities.push({
            id: Date.now() + 1,
            type: "rating-updated",
            bookTitle: bookToEdit.title,
            bookCover: bookToEdit.cover,
            oldRating: oldRating,
            newRating: rating,
            date: new Date().toISOString()
        });
    }

    // Save the updated library.
    localStorage.setItem("user", JSON.stringify(user));

    renderActivities();

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

function renderActivities() {

    const storedUser = localStorage.getItem("user");
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    // Clear the existing activity items.
    activityList.innerHTML = "";

    // If there is no user or no activity, stop here.
    if (!currentUser || !Array.isArray(currentUser.activities)) {
        return;
    }

    // Show the three most recent book additions.
    const activities = currentUser.activities
        .filter(function(activity) {
            return [
                "added",
                "deleted",
                "status-updated",
                "rating-updated"
            ].includes(activity.type);
           
        })
        .sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
        })
        .slice(0, 3);

        const statusLabels = {
            "want-to-read": "Want to Read",
            "reading": "Reading",
            "read": "Read"
        };

    activities.forEach(function(activity) {
        const activityItem = document.createElement("article");
        activityItem.classList.add("activity-item");

        const coverContainer = document.createElement("div");
        coverContainer.classList.add("activity-book-cover");

        const coverImage = document.createElement("img");

        coverImage.src = activity.bookCover
            ? `https://covers.openlibrary.org/b/id/${activity.bookCover}-M.jpg`
            : "assets/images/cover_placeholder.jpg";

        coverImage.alt = `${activity.bookTitle} book cover`;

        coverContainer.appendChild(coverImage);

        const activityContent = document.createElement("div");
        activityContent.classList.add("activity-content");

        const activityText = document.createElement("p");

        // Create the book title in bold.
        const bookTitle = document.createElement("strong");
        bookTitle.textContent = activity.bookTitle;

        if (activity.type === "added") {
            activityText.append("Added ");
            activityText.appendChild(bookTitle);
            activityText.append(" to the bookshelf.");
        } else if (activity.type === "deleted") {
            activityText.append("Removed ");
            activityText.appendChild(bookTitle);
            activityText.append(" from the bookshelf.");
        } else if (activity.type === "status-updated") {
            activityText.append("Changed status of ");
            activityText.appendChild(bookTitle);
            activityText.append(
                ` from ${statusLabels[activity.oldStatus] || activity.oldStatus}` +
                ` to ${statusLabels[activity.newStatus] || activity.newStatus}.`
            );
        } else if (activity.type === "rating-updated") {
            activityText.append("Changed rating of ");
            activityText.appendChild(bookTitle);
            activityText.append(
                ` from ${activity.oldRating} to ${activity.newRating} stars.`
            );
        }
       

        const activityDate = document.createElement("span");
        activityDate.classList.add("activity-date");
        activityDate.textContent = new Date(activity.date).toLocaleDateString();

        activityContent.appendChild(activityText);
        activityContent.appendChild(activityDate);

        activityItem.appendChild(coverContainer);
        activityItem.appendChild(activityContent);

        activityList.appendChild(activityItem);
    });
    
}

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

    let currentShelfIndex = 0;
    const booksPerShelf = 20;

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
            coverImage.src = "assets/images/cover_placeholder.jpg";
        }

        coverImage.onerror = function() {
            console.log("Cover failed to load:", book.title);
            console.log("Attempted URL:", coverImage.src);
        
            coverImage.onerror = null;
            coverImage.src = "assets/images/cover_placeholder.jpg";
        };
      
     
        // Add only the cover to the book element

        // Create the book spine on the left side
        const bookSpine = document.createElement("div");
        bookSpine.classList.add("book-spine");

        // Keep the cover image
        bookElement.appendChild(bookSpine);
        bookElement.appendChild(coverImage);



        bookElement.addEventListener("click", function() {
            editingBookId = book.id;

            modalTitle.textContent = "Book Detail";

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
                editBookCover.src = "assets/images/cover_placeholder.jpg";
            }

            editBookCover.onerror = function() {
                editBookCover.onerror = null;
                editBookCover.src = "assets/images/cover_placeholder.jpg";
            };

            // Load the current book's values.
            statusInput.value = book.status;
            ratingInput.value = book.rating;

            // Open the modal in edit mode.
            addBookModal.style.display = "flex";
            submitBookButton.textContent = "Save Changes";

        });
        
        
        // Add the book to the current shelf.
        bookshelves[currentShelfIndex].appendChild(bookElement);

        // Move to the next shelf after 20 books.
        if (
            bookshelves[currentShelfIndex].children.length >= booksPerShelf &&
            currentShelfIndex < bookshelves.length - 1
        ) {
            currentShelfIndex++;
        }

    });
}

renderBooks();
renderActivities();




         


