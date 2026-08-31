
const params = new URLSearchParams(window.location.search); //getting the browser's current URL

const bookId = params.get("id"); //extracting only the ID value

console.log("Book ID:", bookId);

const bookCover = document.querySelector("#book-cover");
const bookTitle = document.querySelector("#book-title");
const bookAuthor = document.querySelector("#book-author");
const bookDescription = document.querySelector("book-description");

async function getBookDetails() { //async because I am going to use await

    const response =await fetch(
        `https://openlibrary.org${bookId}.json`
    );

    const bookData = await response.json(); //JS object containing the book's details

    //title
 
    bookTitle.textContent = bookData.title;

    //decription
    
    if (bookData.description) {

        bookDescription.textContent = bookData.description.value;

    } else {

        bookDescription.textContent = "No description available";
    }

    //cover

    if ( bookData.covers && bookData.covers.length > 0) {

        bookCover.src = 
        `https://covers.openlibrary.org/b/id/${bookData.covers[0]}-L.jpg`;

    } else {

        bookCover.src = "assets/images/book-placeholder.svg";
    }



    console.log("Book details:" , bookData);
}

getBookDetails();
