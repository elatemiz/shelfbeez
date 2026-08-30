
let editingBookId = null;

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
            bookToEdit.rating = rating;

            console.log("Book updated:", bookToEdit);

            renderBooks();
        }

        editingBookId = null;

    }

    localStorage.setItem("user", JSON.stringify(user));

    addBookModal.style.display = "none";

    
});


function renderBooks() {

    //get user from localStorage
    
    const storedUser = localStorage.getItem("user");
    const user = JSON.parse(storedUser);

    const booksContainer = document.querySelector(".books");

    booksContainer.innerHTML = "";

    //executes the code for each book in the array:

    user.books.forEach(function(book) {
        
        //create div:
        const bookElement = document.createElement("div");
        //class="book"
        bookElement.classList.add("book");

        bookElement.textContent = book.title;

        const deleteButton = document.createElement("button");
        const editButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        editButton.textContent = "Edit";
         
        //Delete
        deleteButton.addEventListener("click", function(){
             
            user.books = user.books.filter(function(bookItem){
                return bookItem.id !== book.id;
            });

            localStorage.setItem("user", JSON.stringify(user));

            renderBooks();
        });

        //Edit
        editButton.addEventListener("click", function(){
              
            editingBookId = book.id;

            statusInput.value = book.status;
            ratingInput.value = book.rating;

            addBookModal.style.display = "flex";

            submitBookButton.textContent = "Save Changes";

            console.log(editingBookId);
        });

        bookElement.appendChild(deleteButton);
        bookElement.appendChild(editButton);


        //place the book inside the .books container
        booksContainer.appendChild(bookElement);
    });      
}

renderBooks();
         


