const pg = require('pg');

let pool = new pg.Pool({
  database: "cloud-todo"
});

module.exports = pool;