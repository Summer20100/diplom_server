require('dotenv').config();
const { Pool } = require('pg');

// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASS,
//     port: process.env.DB_PORT,
// });

//  const pool = new Pool({
//      user: 'bulati4mai',
//      host: 'pg3.sweb.ru',
//      database: 'bulati4mai',
//      password: '&DSN4SHXM1EM6N9c',
//      port: 5432,
//  });

const pool = new Pool({
   user: 'postgres',
   password: 'root',
   host: 'localhost',
   port: 5432,
   database: 'cinema',
});

module.exports = pool;
