import _mysql from "mysql2/promise";

const pool = _mysql.createPool({
host: 'localhost',//127.0.0.1
user: 'root',
password: 'Mypassword',
database: 'ecommerceg1',
waitForConnections: true,
connectionLimit: 8,
queueLimit: 0,

});

export default pool;