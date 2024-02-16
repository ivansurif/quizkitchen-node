import dotenv from 'dotenv';
import express, { Router } from 'express';
import cors from 'cors';

import { extractQuestions } from './router/parseJSONObject.js';
import { serializeJoiSchema } from './router/convertJoiToJson.js';
import { recordSchema } from './schemas/schemas.js';


dotenv.config({ path: '.env.public' }); // Load public configurations
dotenv.config({ path: '.env.private' }); // Load private configurations

	
const app = express();
// Enable CORS for all routes
const corsOptions = {
    origin: 'http://localhost:5173', // or the specific origin of the frontend application
  };
  
app.use(cors(corsOptions));

const collection = process.env.MONGO_COLLECTION;
const db = process.env.MONGO_DB;
console.log(`DB: ${db}\nCollection: ${collection}`)

app.use(express.json());
app.use(express.static('../public')); // TODO: IS THIS NECESSARY?

import { run, insertRecord, getRandomRecord } from './mongoConnect.js';
run().catch(console.error);

app.options('*', cors()); // Include before other routes to handle pre-flight requests for all routes

app.get('/', (req, res) => {
    console.log(`${req.hostname}${req.url}`);
    res.status(200).send('Pinged backend successfully');
});

app.post('/test-connection', (req, res) => {
    console.log(`${req.hostname}${req.url}\n${JSON.stringify(req.body, null, 2)}`);
    res.status(200).json({ message: `Pinged backend successfully`, details: req.body.selectedIndexes });
});

app.post('/add-questions-manual', async (req, res) => {
    try {
        const result = await insertRecord(req.body, collection, db);
        res.status(200).json({ message: `Questions added successfully`, details: result });
    } catch (error) {
        
    if (error.message === 'Data Validation Error') {
        console.log('Data Validation Error Caught');
        res.status(400).json({ error: error.message, details: 'Invalid data provided' });
    } else {
        console.log('Non-Data Validation Error Caught');
        res.status(500).send('Internal Server Error');
    }
    }
    });


// app.get('/schema', (req, res) => {
//     const jsonSchema = serializeJoiSchema(recordSchema);
//     console.log(jsonSchema);
//     res.json(jsonSchema);
// });

app.get('/getQuestion', async (req, res) => {
    try {
        const result = await getRandomRecord(collection, db);
        res.status(200).json({ message: `Questions obtained successfully`, details: result });
            // res.status(200).json({ message: `Questions added successfully`, details: result });
        } catch (error) {
            console.log('Error!');
            console.error(error);
        }});

app.post('/add-questions', (req, res) => {
    try {
        extractQuestions(req);
        res.status(200).send('Questions added successfully');
    } catch (error) {
        res.status(500).send('Error getting questions');
    }
});

app.use(express.urlencoded({ extended: true }));

app.post('/submit', (req, res) => {
    const receivedData = req.body; // The JSON data sent from the client
    if (!receivedData.dataField || receivedData.dataField.trim() === '') {
        console.error('Error: Received empty message');
        res.status(400).json({ message: 'Error: Message is empty' });
        return;
    }
    res.json({ message: 'Data received successfully' });
});

const PORT = process.env.PORT;

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
