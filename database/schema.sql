USE shelfbeez;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    openlibrary_key VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(500) NOT NULL,
    author VARCHAR(255),
    cover_url VARCHAR(500),
    first_publish_year INT,
    isbn VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE user_books (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,
    book_id INT NOT NULL,

    status ENUM(
        'want-to-read',
        'reading',
        'read'
    ) NOT NULL DEFAULT 'want-to-read',

    rating TINYINT,

    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (user_id, book_id),

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    
    FOREIGN KEY (book_id)
        REFERENCES books(id)
        ON DELETE CASCADE,
    
    CHECK (rating IS NULL OR rating BETWEEN 1 AND 5)
);

DESCRIBE user_books;

CREATE TABLE shelves (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
       
);

DESCRIBE shelves;

CREATE TABLE shelf_books (
    shelf_id INT NOT NULL,
    book_id INT NOT NULL,

    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (shelf_id, book_id),

    FOREIGN KEY (shelf_id)
        REFERENCES shelves(id)
        ON DELETE CASCADE,
    
    FOREIGN KEY (book_id)
        REFERENCES shelves(id)
        ON DELETE CASCADE
);

DESCRIBE shelf_books;

CREATE TABLE activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT,

    type ENUM(
        'added',
        'deleted',
        'status_updated',
        'rating_updated',
        'shelf_cretaed'
    ) NOT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (book_id)
        REFERENCES books(id)
        ON DELETE SET NULL     
);

CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    review_text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (user_id, book_id),
    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    FOREIGN KEY (book_id)
        REFERENCES books(id)
        ON DELETE CASCADE
);

DESCRIBE reviews;

SHOW TABLES;

SELECT
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'shelfbeez'
AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY TABLE_NAME;

ALTER TABLE shelf_books
DROP FOREIGN KEY shelf_books_ibfk_2;

SHOW CREATE TABLE shelf_books;

ALTER TABLE shelf_books
ADD CONSTRAINT fk_shelf_books_book
FOREIGN KEY (book_id)
REFERENCES books(id)
ON DELETE CASCADE;

SHOW CREATE TABLE shelf_books;

SELECT
    TABLE_NAME,
    CONSTRAINT_NAME,
    CONSTRAINT_TYPE
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
WHERE TABLE_SCHEMA = 'shelfbeez'
ORDER BY TABLE_NAME, CONSTRAINT_TYPE;

SELECT
    TABLE_NAME,
    INDEX_NAME,
    NON_UNIQUE,
    GROUP_CONCAT(
        COLUMN_NAME
        ORDER BY SEQ_IN_INDEX
    ) AS INDEX_COLUMNS
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'shelfbeez'
GROUP BY TABLE_NAME, INDEX_NAME, NON_UNIQUE
ORDER BY TABLE_NAME;

SELECT
    CONSTRAINT_NAME,
    CHECK_CLAUSE
FROM INFORMATION_SCHEMA.CHECK_CONSTRAINTS
WHERE CONSTRAINT_SCHEMA = 'shelfbeez';

SELECT
    TABLE_NAME,
    CONSTRAINT_NAME,
    DELETE_RULE,
    REFERENCED_TABLE_NAME
FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
WHERE CONSTRAINT_SCHEMA = 'shelfbeez'
ORDER BY TABLE_NAME;

