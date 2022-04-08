//////////////////////////////////////////////////////
// INCLUDES
//////////////////////////////////////////////////////
const express = require('express');
const cors = require('cors');

//////////////////////////////////////////////////////
// INIT
//////////////////////////////////////////////////////
const app = express();
const PORT = process.env.PORT || 3000;

const pool = require('./db'); //Import from db.js

//////////////////////////////////////////////////////
// SETUP APP
//////////////////////////////////////////////////////
app.use(cors());

// REQUIRED TO READ POST>BODY if using "raw" > "JSON"
app.use(express.json());

// REQUIRED TO READ POST>BODY if using "x-www-form-urlencoded"
// If not req.body is empty
app.use(express.urlencoded({ extended: false }));

//////////////////////////////////////////////////////
// POST GET METHODS
// http://localhost:3000/api/
// Use Postman to test
//////////////////////////////////////////////////////
app.get('/api', async (req, res, next) => {
    console.log(req.query);

    res.json(req.query);
});

app.post('/api', async (req, res, next) => {
    console.log(req.body);

    res.json(req.body);
});

//////////////////////////////////////////////////////
// SETUP DB
//////////////////////////////////////////////////////
const CREATE_TABLE_SQL = `
    CREATE TABLE messages (
        id SERIAL primary key,
        message VARCHAR not null
    );
`;

app.post('/api/table', async (req, res, next) => {
    
    pool.query(CREATE_TABLE_SQL)
    .then(() => {
         res.send(`Table created`);
    })
    .catch((error) => {
        res.send(error);
    });
});

//////////////////////////////////////////////////////
// CLEAR DB
//////////////////////////////////////////////////////
const DROP_TABLE_SQL = `
    DROP TABLE IF EXISTS messages;
`;

app.delete('/api/table', async (req, res, next) => {
    
    pool.query(DROP_TABLE_SQL)
    .then(() => {
        res.send(`Table dropped`);
    })
    .catch((error) => {
        res.send(error);
    });
});

//////////////////////////////////////////////////////
// POST GET METHODS CONNECTED TO DB
//////////////////////////////////////////////////////
app.get('/api/message', async (req, res, next) => {
    
    try
    {
        console.log(req.query);

        const allMessage = await pool.query("SELECT * FROM messages"); 

        res.json(allMessage.rows);
    }
    catch(err)
    {
        console.error(err.message);
    }
});

app.post('/api/message', async (req, res, next) => {
    try
    {
        console.log(req.body);
        let message = req.body.message;

        const newInsert = await pool.query("INSERT INTO messages (message) VALUES ($1) RETURNING *", [message]);

        res.json(newInsert);
    }
    catch(err)
    {
        console.error(err.message);
    }
});


//////////////////////////////////////////////////////
// DISPLAY SERVER RUNNING
//////////////////////////////////////////////////////
app.get('/', (req, res) => {
    res.send(`Server running on port ${PORT}`)
});

app.listen(PORT, () => {
    console.log(`App listening to port ${PORT}`);
});