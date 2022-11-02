const pg = require('pg');


/*
database url

postgresql://postgres:
*/
let pool;
if (process.env.DATABASE_URL) {
  pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
  })
}
else {
  pool = new pg.Pool({
    database: "asty-cloud-todo",      // localhost
  });
}

module.exports = pool;