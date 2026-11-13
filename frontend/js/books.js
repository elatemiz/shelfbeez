
const booksGrid = document.querySelector("#books-grid");
const searchForm = document.querySelector("#book-search-form");
const searchInput = document.querySelector("#book-search-input");

const categoryLinks = document.querySelectorAll(".categories a"); //selecting all `<a>` tags within `.categories`. `querySelectorAll()` returns a list containing multiple elements

const loadMoreBtn = document.querySelector("#load-more-btn");

let currentPage = 1;  //keeps track of which results page we are requesting from the API

let currentQuery = ""; //stores the most recent search


function renderBooks(bookToRender, append = false) {

    if (!append) {
        booksGrid.innerHTML = "";
    }

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
        
        bookCard.addEventListener("click", function(){

            window.location.href = `book-detail.html?id=${encodeURIComponent(book.id)}`;

        });

        booksGrid.appendChild(bookCard);
        
    });

}

async function searchBooks(query){

    console.log("Searching:", query);

    try {

    const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=12&page=${currentPage}` 
    );

    console.log("Response:", response);

    const data = await response.json();

    const apiBooks = data.docs.slice(0, 12).map(function(book) {

        return {
            id: book.key,
            title: book.title,
            author: book.author_name
                ? book.author_name[0]
                : "Unknown Author",
            cover: book.cover_i
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                : "assets/images/book-placeholder.svg"
        };
    
    });
    
    renderBooks(apiBooks, currentPage > 1); //If currentPage is 1, the list is cleared.
    //If currentPage is 2 or greater, the books are added to the end of the existing list.

    } catch (error) {

    console.error("API error:", error);

    }
}

categoryLinks.forEach(function(category){ //go through each category link found, one by one.

    category.addEventListener("click", function(event){  //adding a click event to each category
        event.preventDefault();

        const searchTerm = category.dataset.query; //etrieve the data-query value of the clicked category

        searchInput.value = searchTerm; //type the name of the selected category into the search box

        currentQuery = searchTerm;
        currentPage = 1;

        searchBooks(searchTerm); //API request begins, and the books are listed
    });

});


searchForm.addEventListener("submit", function(event){

    event.preventDefault();

    const searchTerm = searchInput.value.trim();

    if (searchTerm === "") {
        return;
    }

    //When a new search is performed, first update the search term and the page number
    currentQuery = searchTerm; 
    currentPage = 1;

    searchBooks(searchTerm);

});

loadMoreBtn.addEventListener("click", function(){  //user clicks "Load More."

    currentPage++; //currentPage is incremented by one

    searchBooks(currentQuery); //request is sent to the API again with the same search term
    //currentPage > 1, new books are added below the existing list
})