
const params = new URLSearchParams(window.location.search); //getting the browser's current URL

const bookId = params.get("id"); //extracting only the ID value

console.log("Book ID:", bookId);

//HTML elements

const bookCover = document.querySelector("#book-cover");
const bookTitle = document.querySelector("#book-title");
const bookAuthor = document.querySelector("#book-author");
const bookDescription = document.querySelector("#book-description");
const bookStatus = document.querySelector("#book-status");
const bookRating = document.querySelector("#book-rating");
const saveBookBtn = document.querySelector("#save-book-btn");



//get author name

async function getAuthorName(authorKey){

    let bookToSave = null;
    let existingBook = null;
    

    const response = await fetch(
        `https://openlibrary.org${authorKey}.json`
    );

    const authorData = await response.json();

    return authorData.name;
}

const storedUser = localStorage.getItem("user"); //get user from localStorage

let user = null;

if (storedUser){

    user = JSON.parse(storedUser);
}

saveBookBtn.addEventListener("click", function() {

    const selectedStatus = bookStatus.value;
    const selectedRating = Number(bookRating.value);

    if (existingBook) {

        existingBook.status = selectedStatus;
        existingBook.rating = selectedRating;

        console.log("Existing book updated:", existingBook);

    } else {

        bookToSave.status = selectedStatus;
        bookToSave.rating = selectedRating;

        user.books.push(bookToSave);

        console.log("New book added:", bookToSave);

        if (!user.activities) {
            user.activities = [];
        }

        const userActivities = {
            id: Date.now(),
            type: "added",
            bookTitle: bookToSave.title,
            bookCover: bookToSave.cover,
            date: new Date().toISOString()
            
    }

    user.activities.push(userActivities);
}

    localStorage.setItem("user", JSON.stringify(user));

    console.log("User books:", user.books);
}); 
   
//get book details

async function getBookDetails() { //async because I am going to use await

    const response =await fetch(
        `https://openlibrary.org${bookId}.json`
    );

    const bookData = await response.json(); //JS object containing the book's details


    //a book object created from actual Open Library data:
    bookToSave = {
        id: bookData.key,
        title: bookData.title,
        author: "Unknown Author",
        cover: bookData.covers ? bookData.covers[0] : null,
        status: "want-to-read",
        rating: 0
    };

    console.log("Book To Save:", bookToSave);

    //check if this book is already exist:

    existingBook = user.books.find(function(book) {
        return book.id === bookToSave.id;
    });

    console.log("Existing book:", existingBook);

  


    //title
 
    bookTitle.textContent = bookData.title;

    // author

    if (bookData.authors && bookData.authors.length > 0) {

    const authorKey = bookData.authors[0].author.key;

    const authorName = await getAuthorName(authorKey);

    bookAuthor.textContent = authorName;
    bookToSave.author = authorName;

    
    } else {
        bookAuthor.textContent = "Unknown Author";    
   
  }

    // description

    if (bookData.description) {

        let description = bookData.description;

        if (typeof description === "object") {

           description = description.value;
        }

           const pdfIndex = description.indexOf("[**PDF**]");

             if (pdfIndex !== -1) {

                 description = description.substring(0, pdfIndex);
            }

       bookDescription.textContent = description.trim();

    } else {

          bookDescription.textContent = 
          "No description available";

    }
   
    //cover

    if ( bookData.covers && bookData.covers.length > 0) {
         
        console.log("Cover ID:", bookData.covers[0]);

        const coverUrl =
            `https://covers.openlibrary.org/b/id/${bookData.covers[0]}-L.jpg`;
    
        console.log("Cover URL:", coverUrl);
    
        bookCover.src = coverUrl;
    } 


    console.log("Book details:" , bookData);
}

getBookDetails();
