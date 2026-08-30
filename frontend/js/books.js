
const booksGrid = document.querySelector("#books-grid");
const searchForm = document.querySelector("#book-search-form");
const searchInput = document.querySelector("#book-search-input");


const books = [
    {
        id: 1,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        cover: "assets/images/books4.svg"
    },
    {
        id: 2,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        cover: "assets/images/books2.svg"
    },
    {
        id: 3,
        title: "The Little Prince",
        author: "Antoine de Saint-Exupéry",
        cover: "assets/images/books1.svg"
    },
    {
        id: 4,
        title: "Harry Potter",
        author: "J.K. Rowling",
        cover: "assets/images/plant5.svg"
    },
    {
        id: 5,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        cover: "assets/images/plant6.svg"
    },
    {
        id: 6,
        title: "1984",
        author: "George Orwell",
        cover: "assets/images/plant1.svg"
    }
];

function renderBooks(bookToRender){
      
    booksGrid.innerHTML = "";

    bookToRender.forEach(function(book){

        const bookCard = document.createElement("div");
        
        bookCard.classList.add("book-card");

        bookCard.innerHTML = `
            
            <img src= "${book.cover}"
                 alt= "${book.title}"
            >

            <h3>${book.title}</h3>

            <p>${book.author}</p>
        
        `;

        booksGrid.appendChild(bookCard);
        
    });

}

renderBooks(books);

searchForm.addEventListener("submit", function(event){

    event.preventDefault();

    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredBooks = books.filter(function(book){

        return (
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm)
        );

    });

    console.log("Search term:", searchTerm);
    console.log("Filtered books:", filteredBooks);

    renderBooks(filteredBooks);

});