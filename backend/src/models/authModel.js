const db = require("../config/db"); //using the MySQL connection pool from the `db.js` file created earlier

//find a user by email or username
async function findUserByEmailOrUsername(email, username) {
    const [rows] = await db.query(
        "SELECT id, username, email FROM users WHERE email = ? OR username = ?",
        [email, username]
    );
     
    return rows;
}

//create a new user
async function createUser(username, email, passwordHash, name) {
    const [result] = await db.query(
        "INSERT INTO users (username, email, password_hash, name) VALUES (?, ?, ?, ?)",
        [username, email, passwordHash, name]
    );

    return result.insertId;
}

module.exports = {
    findUserByEmailOrUsername,
    createUser
};