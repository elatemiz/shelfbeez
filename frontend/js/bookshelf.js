const shelf1 = document.querySelector("#shelf-1");
const shelf2 = document.querySelector("#shelf-2");
const shelf3 = document.querySelector("#shelf-3");

async function loadBookshelfBooks() {

    try {

        const response = await fetch(
            "https://openlibrary.org/search.json?q=subject:fiction&limit=12&fields=key,title,author_name,cover_i"
        );

        const data = await response.json();

        const books = data.docs.map(function(book){

            return {
                id: book.key,
                title: book.title,
                author: book.author_name
                    ? book.author_name[0]
                    : "Unknown Author",
                cover: book.cover_i
                    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                    : "assets/images/cover_placeholder.jpg"
            };
        });

        renderBookshelf(books);

    } catch(error) {

        console.error("Bookshelf API error", error);
    }
}

function renderBookshelf(books) {

    const shelves = [shelf1, shelf2, shelf3];

    books.forEach(function(book, index) {

        const bookElement =document.createElement("div");

        bookElement.classList.add("book");

        bookElement.innerHTML = `
            <img
                src="${book.cover}"
                class="book-cover"
                alt="${book.title}"
            >

            <div class="book-spine"></div>
        `;

        bookElement.addEventListener("click", function() {

            window.location.href = 
               `book-detail.html?id=${encodeURIComponent(book.id)}`;

        });

        const shelfIndex = Math.floor(index / 4); //divides the books into groups of four

        shelves[shelfIndex].appendChild(bookElement);
    
    });
}

loadBookshelfBooks();