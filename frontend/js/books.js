
const booksGrid = document.querySelector("#books-grid");
const searchForm = document.querySelector("#book-search-form");
const searchInput = document.querySelector("#book-search-input");


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
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
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
    
    renderBooks(apiBooks);

    } catch (error) {

    console.error("API error:", error);

    }
}


searchForm.addEventListener("submit", function(event){

    event.preventDefault();

    const searchTerm = searchInput.value.trim();

    if (searchTerm === "") {
        return;
    }

    searchBooks(searchTerm);


});