// const mysql = require('mysql2');
// const fs = require('fs');
// const path = require('path');

// require('dotenv').config();

// const connectionConfig = {
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
//     port: process.env.DB_PORT
// };

// if (process.env.DB_SSL === 'true') {
//     const sslOptions = {};

//     if (process.env.DB_SSL_CA_FILE) {
//         const caPath = path.resolve(process.cwd(), process.env.DB_SSL_CA_FILE);
//         try {
//             sslOptions.ca = fs.readFileSync(caPath);
//         } catch (err) {
//             console.error(`Unable to read CA file at ${caPath}`);
//             throw err;
//         }
//     } else if (process.env.DB_SSL_CA_BASE64) {
//         sslOptions.ca = Buffer.from(process.env.DB_SSL_CA_BASE64, 'base64');
//     }

//     sslOptions.rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false';
//     if (Object.keys(sslOptions).length > 0) {
//         connectionConfig.ssl = sslOptions;
//     }
// }

// const connection = mysql.createConnection(connectionConfig);

// connection.connect((err) => {
//     if (err) throw err;
//     console.log('Connected to MySQL database');
// });

// module.exports = connection;


const mysql = require('mysql2');
require('dotenv').config();

const connectionConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
    }
};

const connection = mysql.createPool(connectionConfig);

connection.query('SELECT 1', (err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

module.exports = connection;