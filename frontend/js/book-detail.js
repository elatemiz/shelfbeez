
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

//get author name

async function getAuthorName(authorKey){

    const response = await fetch(
        `https://openlibrary.org${authorKey}.json`
    );

    const authorData = await response.json();

    return authorData.name;
}

const storedUser = localStorage.getItem("user");

let user = null;

if (storedUser){

    user = JSON.parse(storedUser);
}


console.log("User books:", user.books);

const userBook = user.books.find(function(book){
      return book.id === bookId;
});

console.log("user book:", userBook);

if ( userBook) {
    bookStatus.value = userBook.status;
    bookRating.value = userBook.rating;
}

//get book details

async function getBookDetails() { //async because I am going to use await

    const response =await fetch(
        `https://openlibrary.org${bookId}.json`
    );

    const bookData = await response.json(); //JS object containing the book's details

    //title
 
    bookTitle.textContent = bookData.title;

    // author

    if (bookData.authors && bookData.authors.length > 0) {

    const authorKey = bookData.authors[0].author.key;

    const authorName = await getAuthorName(authorKey);

    bookAuthor.textContent = authorName;

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
