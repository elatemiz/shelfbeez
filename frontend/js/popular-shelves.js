const popularShelves = [
    {
        id: 1,
        name: "Fantasy Collection",
        username: "alex",
        bookCount: 42,
        books: [
            {
                title: "Book One",
                cover: "assets/images/cover_placeholder.jpg"
            },
            {
                title: "Book Two",
                cover: "assets/images/cover_placeholder.jpg"
            },
            {
                title: "Book Three",
                cover: "assets/images/cover_placeholder.jpg"
            },
            {
                title: "Book Four",
                cover: "assets/images/cover_placeholder.jpg"
            }
        ]
    },
    {
        id: 2,
        name: "My Favorite Reads",
        username: "sophia",
        bookCount: 28,
        books: [
            {
                title: "Book One",
                cover: "assets/images/cover_placeholder.jpg"
            },
            {
                title: "Book Two",
                cover: "assets/images/cover_placeholder.jpg"
            },
            {
                title: "Book Three",
                cover: "assets/images/cover_placeholder.jpg"
            },
            {
                title: "Book Four",
                cover: "assets/images/cover_placeholder.jpg"
            }
        ]
    },
    {
        id: 3,
        name: "The Reading Corner",
        username: "james",
        bookCount: 35,
        books: [
            {
                title: "Book One",
                cover: "assets/images/cover_placeholder.jpg"
            },
            {
                title: "Book Two",
                cover: "assets/images/cover_placeholder.jpg"
            },
            {
                title: "Book Three",
                cover: "assets/images/cover_placeholder.jpg"
            },
            {
                title: "Book Four",
                cover: "assets/images/cover_placeholder.jpg"
            }
        ]
    },
    {
        id: 4,
        name: "Books & Beyond",
        username: "emma",
        bookCount: 19,
        books: [
            {
                title: "Book One",
                cover: "assets/images/cover_placeholder.jpg"
            },
            {
                title: "Book Two",
                cover: "assets/images/cover_placeholder.jpg"
            },
            {
                title: "Book Three",
                cover: "assets/images/cover_placeholder.jpg"
            },
            {
                title: "Book Four",
                cover: "assets/images/cover_placeholder.jpg"
            }
        ]
    }
];

const popularShelvesGrid = document.querySelector("#popular-shelves-grid");

function renderPopularShelves(shelves) { //unction takes an array of shelves as input

    popularShelvesGrid.innerHTML = ""; //clears previously added cards

    shelves.forEach(function(shelf) { //runs once for each shelf in the array

        const shelfCard = document.createElement("article"); //creates a new HTML article element
 
        shelfCard.classList.add("shelf-card"); //adds the existing CSS class to the element

        // Shelf books container
        const shelfBooks = document.createElement("div");
        shelfBooks.classList.add("shelf-books");

        // Decorative light
        shelfBooks.innerHTML = `
            <img
                src="assets/images/light.svg"
                alt=""
                class="decor-light"
            >
        `;

        // Book covers
        shelf.books.forEach(function(book) { //creating the book covers for that shelf

            const shelfBook = document.createElement("div");
            shelfBook.classList.add("shelf-book");

            const bookCover = document.createElement("img");

            bookCover.src = book.cover;
            bookCover.alt = book.title;

            shelfBook.appendChild(bookCover);
            shelfBooks.appendChild(shelfBook);

        });

        // Shelf information
        //Instead of the names and book counts that we previously hardcoded into the HTML, we are now using our own data
        const shelfInfo = document.createElement("div");
        shelfInfo.classList.add("shelf-info");

        shelfInfo.innerHTML = `
            <h3>${shelf.name}</h3>

            <p>
                ${shelf.bookCount} books · @${shelf.username}
            </p>
        `;

        // Add elements to card
        shelfCard.appendChild(shelfBooks);
        shelfCard.appendChild(shelfInfo);

        // Open user profile
        shelfCard.addEventListener("click", function() {
            window.location.href =
                `profile.html?username=${encodeURIComponent(shelf.username)}`;
        });

        // Add card to grid
        popularShelvesGrid.appendChild(shelfCard);


    });

}

renderPopularShelves(popularShelves);