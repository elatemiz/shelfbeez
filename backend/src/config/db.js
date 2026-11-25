
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "127.0.0.1",
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;

//mysql2/promise: MySQL ile bağlantı kurmamızı sağlar. Promise desteği sayesinde ileride async/await kullanabileceğiz.

//createPool(): Veritabanı bağlantı havuzu oluşturur. Her istekte sıfırdan bağlantı açmak yerine bağlantıları yönetir.

//process.env: Ana dizindeki .env dosyasından okuduğumuz bilgileri kullanır.

//module.exports: Oluşturduğumuz bağlantı havuzunu diğer dosyalarda kullanabilmemizi sağlar.