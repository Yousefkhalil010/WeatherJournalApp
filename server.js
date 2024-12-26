// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Require Express to run server and routes
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

// Start up an instance of app
const app = express();

/* Middleware */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// POST route
app.post('/add', (req, res) => {
    projectData['temp'] = req.body.temp;
    projectData['date'] = req.body.date;
    projectData['content'] = req.body.content;
    res.send(projectData);
});

// GET route to return all project data
app.get('/all', (req, res) => {
    res.send(projectData);
});

// GET route to send the API key to the client
app.get('/get-api-key', (req, res) => {
    res.send({ apiKey: process.env.API_KEY });
});

// Set up and Spin up the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
