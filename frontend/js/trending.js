const trendingBooksGrid = document.querySelector("#trending-books-grid");

//function communicates with the Open Library API
//async because we want to use await inside the function and wait for the API response without blocking the rest of the page

async function loadTrendingBooks() {

    try { //try defines a block of code that might produce an error
        
        //fetch() is a JS func used to send HTTP requests, in this case we send GET 
        const response = await fetch( //await tells JavaScript to wait until the Promise returned by fetch() settles
            "https://openlibrary.org/search.json?q=subject:fiction&sort=rating desc&limit=4&fields=key,title,author_name,cover_i"
        );

        const data =  await response.json(); //The API returns its response in JSON format.

        //map() is an array method that creates a new array by transforming every element of an existing array

        const trendingBooks = data.docs.map(function(book) { 

            return { //return to create and return a new object for each book
                id: book.key,
                title: book.title,
                author: book.author_name
                    ? book.author_name[0]
                    : "Unknown Author",
                cover: book.cover_i
                    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                    : "assets/images/cover_palceholder.jpg"
            };
        });

        //renderTrendingBooks() is responsible for creating the HTML elements and displaying the books on the page

        renderTrendingBooks(trendingBooks); ///Creates and displays book cards.
    
    } catch (error) { //If an error occurs inside the try block, JavaScript moves to the corresponding catch block.
        console.error("Trending books API error:", error);

    }

}
//loadTrendingBooks(), fetched book information from the Open Library API and prepared it as an array of objects

//renderTrendingBooks() takes that array and turns each book object into an HTML element

function renderTrendingBooks(books) { //books is the data that this function will display

    trendingBooksGrid.innerHTML = ""; //emoves all existing HTML content inside the grid

    books.forEach(function(book){ //forEach() because I want to create one HTML card for every book

        //DOM manipulation
        const bookCard = document.createElement("article"); //creates a new article element

        bookCard.classList.add("book-card"); //dds a CSS class to an HTML element
        
        //JavaScript creates this HTML automatically. We don't need to write four separate cards manually in index.html

        bookCard.innerHTML = `
            <img
                src="${book.cover}" 
                alt="${book.title}"
            >
            <div class="book-info">
                <h3>${book.title}</h3>
                <p>${book.author}</p>  
            </div>
        `;

        bookCard.addEventListener("click", function(){

            window.location.href = `book-detail.html?id=${encodeURIComponent(book.id)}`;
        });

        //appendChild() is a DOM method that inserts an element inside another element, at the end of its child list
        
        trendingBooksGrid.appendChild(bookCard);
        
        //Because appendChild() is inside the forEach() callback, it executes once for every book
    });

}

loadTrendingBooks();