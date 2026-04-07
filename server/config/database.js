const mysql = require('mysql2');
const fs = require('fs');
require('dotenv').config();

const connectionConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT, 10),
    // ssl: {
    //      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'false' ? false : true
    // }
    ssl: {
        ca: fs.readFileSync("ca.pem"),
    },
};

const connection = mysql.createPool(connectionConfig);

if (process.env.NODE_ENV !== 'test') {
    connection.query('SELECT 1', (err) => {
        if (err) {
            console.error('MySQL connection failed:', err);
            process.exit(1);
        } else {
            console.log('Connected to MySQL database successfully!');
        }
    });
}

module.exports = connection;
