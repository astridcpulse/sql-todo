require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./modules/pool');
const app = express();

// Serve static files from server/public folder
app.use(express.static('server/public'));

// Setup body parser to read request JSON body
app.use(bodyParser.urlencoded({ extended: true }));


/**
 * GET /tasks
 * --> array of task objects
 * [
    {
      name: 'Mow the lawn', // string or VARCHAR
      isCompleted: true     // BOOLEAN
    }
  ]
 */
app.get('/tasks', (req, res) => {
  let queryString = `SELECT * FROM "tasks" ORDER BY "id" ASC;`
  pool.query(queryString)
    .then((results) => {
      res.send(results.rows);
    })
    .catch((err) => {
      console.error("GET request failed", err);
      res.sendStatus(500);
    })
});

app.post('/tasks', (req, res) => {
  console.log("POST /tasks req.body:", req.body);
  let taskName = req.body.name;
  console.log("task name is", taskName);

  let queryString = `
    INSERT INTO "tasks" ("name") 
    VALUES ($1);
  `;
  pool.query(queryString, [taskName])
    .then((results) => {
      res.sendStatus(201)
    })
    .catch((err) => {
      console.error("POST request failed", err);
      res.sendStatus(500);
    });
});

app.put('/tasks/:id', (req, res) => {
  // Grab task ID from URL
  let taskId = req.params.id;
  // Grab isComplete value from body
  let isComplete = req.body.isComplete;

  console.log(`Setting ${taskId} to ${isComplete}`);

  // Update task in DB
  let queryString = `
    UPDATE "tasks" 
    SET "isComplete" = $1
    WHERE "id" = $2;
  `;
  pool.query(queryString, [isComplete, taskId])
    .then((results) => {
      res.sendStatus(200)
    })
    .catch((err) => {
      console.error("PUT request failed", err);
      res.sendStatus(500);
    });
});

// process.env

const port = process.env.PORT || 3000;

console.log(`We're going to listen on port`, port);
app.listen(port, () => {
  console.log(`Listening on ${port}`);
})