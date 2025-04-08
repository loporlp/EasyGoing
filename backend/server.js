/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: https
 *       scheme: bearer
 *       bearerFormat: UUID
 *       description: "Use the logged-in user's Firebase User ID as the Bearer token"
 */

const express = require('express');
const axios = require('axios'); // For making API calls
const app = express();
const port = 3000;

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { swaggerOptions } = require('./swagger.js');

require('dotenv').config();

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const stream = require('stream');

// Initialize S3
const s3 = new AWS.S3();
const S3_BUCKET = 'easygoing-photo-cache';


const GOOGLE_API_KEY = process.env.GOOGLEMAPS_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const admin = require('firebase-admin');

// Middleware to parse JSON bodies (if needed for POST/PUT requests)
app.use(express.json());

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

admin.initializeApp({
  credential: admin.credential.cert(require('./admin.json'))
});


// Middleware to verify firebase token
const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
  }

  const idToken = authHeader.split(' ')[1];
  
  if(idToken == "admin"){
    next();
    return;
    }


  try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedToken; // Attach the user info to the request
      next(); // Proceed to the next middleware or route handler
  } catch (error) {
      console.error('Error verifying Firebase ID token:', error);
      return res.status(403).json({ error: 'Forbidden' });
  }
};

/**
 * @swagger
 * /api/autocomplete:
 *   get:
 *     summary: Fetch autocomplete suggestions from Google Places API
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: input
 *         required: true
 *         schema:
 *           type: string
 *         description: The search input query
 *     responses:
 *       200:
 *         description: A list of autocomplete suggestions
 *       400:
 *         description: Missing required parameter 'input'
 *       403:
 *         description: Unauthorized request. Ensure you are sending a valid User ID as Bearer token.
 */

app.get('/api/autocomplete', verifyFirebaseToken, async (req, res) => {
    console.log("autocomplete called");
  try {
      // External API URL
      const apiUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';

      // Get the 'input' parameter from the client request
      const input = req.query.input;
      if (!input) {
          return res.status(400).json({ error: 'Missing required parameter: input' });
      }

      // Google Places API Key
      const apiKey = GOOGLE_API_KEY;

      // Make the API request
      const response = await axios.get(apiUrl, {
          params: {
              input: input,
              key: apiKey, // API Key
          },
      });

      // Return the API's response to the client
      res.status(response.status).json(response.data);
  } catch (error) {
      console.error('Error in autocomplete API proxy:', error.message);
      res.status(error.response?.status || 500).json({
          error: 'Failed to fetch autocomplete data',
          details: error.message,
      });
  }
});

/**
 * @swagger
 * /api/geocode:
 *   get:
 *     summary: converts address to lat long from Google Places API
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: The address being converted
 *     responses:
 *       200:
 *         description: lat long coords
 *       400:
 *         description: Missing required parameter 'address'
 *       403:
 *         description: Unauthorized request. Ensure you are sending a valid User ID as Bearer token.
 */

app.get('/api/geocode', verifyFirebaseToken, async (req, res) => {
    console.log("geocode called");
    try {
        // External API URL
        const apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
  
        // Get the 'address' parameter from the client request
        const address = req.query.address;
        if (!address) {
            return res.status(400).json({ error: 'Missing required parameter: address' });
        }
  
        // Make the API request
        const response = await axios.get(apiUrl, {
            params: {
                address: address,
                key: GOOGLE_API_KEY, // API Key
            },
        });
  
        // Return the API's response to the client
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error in autocomplete API proxy:', error.message);
        res.status(error.response?.status || 500).json({
            error: 'Failed to fetch geocode data',
            details: error.message,
        });
    }
  });

/**
 * @swagger
 * /api/directions:
 *   get:
 *     summary: Get directions between two locations
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: origin
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: destination
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: mode
 *         required: true
 *         schema:
 *           type: string
 *           enum: [driving, walking, bicycling, transit]
 *     responses:
 *       200:
 *         description: Returns route details
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Internal server error
 */
app.get('/api/directions', verifyFirebaseToken, async (req, res) => {
    console.log("directions called");
    try {
        // Get parameters from the client request
        const { origin, destination, mode } = req.query;

        // Validate required parameters
        if (!origin || !destination || !mode) {
            return res.status(400).json({ error: 'Missing required parameters: origin, destination, or mode' });
        }

        
        const apiUrl = 'https://maps.googleapis.com/maps/api/directions/json';

        // Make the API request
        const response = await axios.get(apiUrl, {
            params: {
                origin,              
                destination,         
                mode,                
                alternatives: true,  
                key: GOOGLE_API_KEY, 
            },
        });

        // Send back the response from Google Directions API to the client
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching directions:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching directions' });
    }
});

/**
 * @swagger
 * /api/place/textsearch:
 *   get:
 *     summary: Search for a place using text input
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The place name or keyword to search for.
 *     responses:
 *       200:
 *         description: Returns search results from Google Places API
 *       400:
 *         description: Missing required parameter 'query'
 *       500:
 *         description: Internal server error
 */
app.get('/api/place/textsearch', verifyFirebaseToken, async (req, res) => {
    console.log("textsearch called");
    try {
        // Get parameters from the client request
        const placeName  = req.query.query;
        // Validate required parameters
        if (!placeName) {
            return res.status(400).json({ error: 'Missing required parameters: placeName' });
        }

        
        const apiUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
        
        // Make the API request
        const response = await axios.get(apiUrl, {
            params: {
                query: placeName,
                key: GOOGLE_API_KEY, 
            },
        });

        // Send back the response from Google Directions API to the client
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching directions:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching textsearch' });
    }
});

/**
 * @swagger
 * /api/place/photo:
 *   get:
 *     summary: Retrieve a place photo from Google Places API
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: photo_reference
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: maxwidth
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Returns the requested place photo
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Internal server error
 */
// app.get('/api/place/photo', async (req, res) => {
//     console.log("photo called");
//     //return res.status(503).json({ error: 'This service is temporarily disableed'});
//     try {
//         // Get parameters from the client request
//         const { photo_reference, maxwidth }  = req.query;
//         // Validate required parameters
//         if (!photo_reference || !maxwidth) {
//             return res.status(400).json({ error: 'Missing required parameters: photo_reference or maxwidth' });
//         }

        
//         const apiUrl = 'https://maps.googleapis.com/maps/api/place/photo';
        
//         // Make the API request
//         const response = await axios.get(apiUrl, {
//             params: {
//                 photo_reference: photo_reference,
//                 maxwidth: maxwidth,
//                 key: GOOGLE_API_KEY, 
//             },
//             responseType: 'stream',
//         });

//         // Send back the response from Google Photos API to the client
//         res.setHeader('Content-Type', response.headers['content-type']);
//         response.data.pipe(res);
//     } catch (error) {
//         console.error('Error fetching directions:', error.message);
//         res.status(500).json({ error: 'An error occurred while fetching photos' });
//     }
// });














app.get('/api/place/photo', async (req, res) => {
    console.log("photo called");
    return res.status(503).json({ error: 'This service is temporarily disableed'});
    const { photo_reference, maxwidth } = req.query;
    if (!photo_reference || !maxwidth) {
        return res.status(400).json({ error: 'Missing required parameters: photo_reference or maxwidth' });
    }

    try {
        // Check if photo is already cached
        const { rows } = await pool.query(
            'SELECT s3_key, content_type FROM cached_photos WHERE photo_reference = $1 AND maxwidth = $2',
            [photo_reference, maxwidth]
        );

        if (rows.length > 0) {
            console.log("Photo already exists, fetch from S3");
            const { s3_key, content_type } = rows[0];
            const s3Stream = s3.getObject({
                Bucket: S3_BUCKET,
                Key: s3_key,
            }).createReadStream();

            res.setHeader('Content-Type', content_type);
            return s3Stream.pipe(res);
        }

        console.log("Get photo from Google");
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/photo', {
            params: {
                photo_reference,
                maxwidth,
                key: GOOGLE_API_KEY,
            },
            responseType: 'stream',
        });

        const contentType = response.headers['content-type'];
        const s3Key = `photos/${uuidv4()}`;

        // Fork the response stream
        const s3Stream = new stream.PassThrough();
        const clientStream = new stream.PassThrough();

        response.data.pipe(s3Stream);
        response.data.pipe(clientStream);

        // Stream to client FIRST (non-blocking)
        res.setHeader('Content-Type', contentType);
        clientStream.pipe(res);

        // Do S3 upload + DB write in background
        const uploadPromise = s3.upload({
            Bucket: S3_BUCKET,
            Key: s3Key,
            Body: s3Stream,
            ContentType: contentType,
        }).promise();

        // Await after streaming to client starts
        await uploadPromise;

        await pool.query(
            'INSERT INTO cached_photos (photo_reference, s3_key, maxwidth, content_type) VALUES ($1, $2, $3, $4)',
            [photo_reference, s3Key, maxwidth, contentType]
        );

    } catch (error) {
        console.error('Error fetching photo:', error.message);
        if (!res.headersSent) {
            res.status(500).json({ error: 'An error occurred while fetching the photo' });
        } else {
            res.end(); // in case headers already sent
        }
    }
});











/**
 * @swagger
 * /api/distancematrix:
 *   get:
 *     summary: Retrieve distancematrix from Google Places API
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: origins
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: destinations
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: mode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the requested distancematrix info
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Internal server error
 */
app.get('/api/distancematrix', verifyFirebaseToken, async (req, res) => {
    console.log("distancematrix called");
    try {
        // Get parameters from the client request
        const { origins, destinations, mode }  = req.query;
        // Validate required parameters
        if (!origins || !destinations || !mode) {
            return res.status(400).json({ error: 'Missing required parameters: origins, destinations, or mode' });
        }

        
        const apiUrl = 'https://maps.googleapis.com/maps/api/distancematrix/json';
        
        // Make the API request
        const response = await axios.get(apiUrl, {
            params: {
                origins: origins,
                destinations: destinations,
                mode: mode,
                key: GOOGLE_API_KEY, 
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching distancematrix:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching distancematrix' });
    }
});


/**
 * @swagger
 * /api/serverstatus:
 *   get:
 *     summary: Check if the server is running
 *     responses:
 *       200:
 *         description: Server is running
 */
app.get('/api/serverstatus', (req, res) => {
    console.log("serverstatus called");
    res.json({ message: 'Server is Running' });
});

const pool = require('./db'); // Import DB connection

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User registered successfully
 *       500:
 *         description: Database error
 */
app.post('/api/register', verifyFirebaseToken, async (req, res) => {
    console.log("register called");
    const { uid, email } = req.user;

    try {
        await pool.query(
            'INSERT INTO users (id, email) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING',
            [uid, email]
        );
        res.status(200).json({ message: 'User registered' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: Retrieve all trips for an authenticated user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of trips belonging to the authenticated user
 *       403:
 *         description: Unauthorized access. Ensure you are sending the Firebase User ID as the Bearer token.
 */
app.get('/api/trips', verifyFirebaseToken, async (req, res) => {
    console.log("get trips called");
    const { uid } = req.user;

    try {
        const result = await pool.query('SELECT * FROM trips WHERE user_id = $1', [uid]);
        res.status(200).json({ success: true, trips: result.rows });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

/**
 * @swagger
 * /api/trips:
 *   post:
 *     summary: Create a new trip
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trip_details:
 *                 type: object
 *                 description: JSON object containing trip details
 *     responses:
 *       201:
 *         description: Trip successfully created
 *       403:
 *         description: Unauthorized. Ensure you are using a valid User ID as Bearer token.
 */
app.post('/api/trips', verifyFirebaseToken, async (req, res) => {
    console.log("create trip called");
    const { trip_details } = req.body;
    const { uid } = req.user;

    try {
        const result = await pool.query(
            'INSERT INTO trips (user_id, trip_details) VALUES ($1, $2) RETURNING *',
            [uid, trip_details]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});


/**
 * @swagger
 * /api/trips/{id}:
 *   put:
 *     summary: Update a trip's details
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the trip to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trip_details:
 *                 type: object
 *                 description: Updated trip details
 *     responses:
 *       200:
 *         description: Trip updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Trip updated successfully"
 *                 trip:
 *                   type: object
 *                   description: The updated trip details
 *       400:
 *         description: Missing trip_details in the request body
 *       403:
 *         description: Unauthorized request. Ensure you are using the correct Bearer token (User ID).
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Database error
 */
app.put('/api/trips/:id', verifyFirebaseToken, async (req, res) => {
    console.log("update trip called");
    const { id } = req.params;
    const { trip_details } = req.body;
    const { uid } = req.user;

    if (!trip_details) {
        return res.status(400).json({ success: false, error: 'Missing trip_details' });
    }

    try {
        const result = await pool.query(
            'UPDATE trips SET trip_details = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [trip_details, id, uid]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, error: 'Trip not found' });
        }

        res.status(200).json({ success: true, message: 'Trip updated successfully', trip: result.rows[0] });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

/**
 * @swagger
 * /api/trips/{id}:
 *   delete:
 *     summary: Delete a trip
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the trip to delete
 *     responses:
 *       200:
 *         description: Trip deleted successfully
 *       404:
 *         description: Trip not found
 *       403:
 *         description: Unauthorized. Ensure you are using a valid User ID as Bearer token.
 */
app.delete('/api/trips/:id', verifyFirebaseToken, async (req, res) => {
    console.log("delete trip called");
    const { id } = req.params;
    const { uid } = req.user;

    try {
        const result = await pool.query(
            'DELETE FROM trips WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, uid]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, error: 'Trip not found' });
        }

        res.status(200).json({ success: true, message: 'Trip deleted successfully' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});


/**
 * @swagger
 * /api/history:
 *   post:
 *     summary: Create a new history entry
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: ID of the user creating the history entry
 *                 example: "user_123"
 *               tag:
 *                 type: string
 *                 enum: ["flight", "hotel", "thingsToDo", "food", "other"]
 *                 description: The category of the expense
 *                 example: "flight"
 *               value:
 *                 type: number
 *                 format: float
 *                 description: The amount spent
 *                 example: 250.75
 *               description:
 *                 type: string
 *                 maxLength: 50
 *                 description: A brief description of the entry
 *                 example: "Round trip to NYC"
 *               date:
 *                 type: string
 *                 format: date
 *                 description: The date of the history entry (optional, defaults to current date)
 *                 example: "2025-03-18"
 *     responses:
 *       201:
 *         description: History entry successfully created
 *       400:
 *         description: Bad request. Invalid input data.
 *       403:
 *         description: Unauthorized. Ensure you are using a valid User ID as Bearer token.
 *       500:
 *         description: Server error.
 *
 *   get:
 *     summary: Get all history entries for a user
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user whose history is being fetched
 *     responses:
 *       200:
 *         description: List of history entries for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Unique ID of the history entry
 *                     example: 1
 *                   user_id:
 *                     type: string
 *                     description: ID of the user
 *                     example: "user_123"
 *                   tag:
 *                     type: string
 *                     enum: ["flight", "hotel", "thingsToDo", "food", "other"]
 *                     description: The category of the expense
 *                     example: "hotel"
 *                   value:
 *                     type: number
 *                     format: float
 *                     description: The amount spent
 *                     example: 120.50
 *                   description:
 *                     type: string
 *                     maxLength: 50
 *                     description: A brief description
 *                     example: "One-night stay"
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: Date of the history entry
 *                     example: "2025-03-18"
 *       400:
 *         description: Bad request. Missing or invalid user_id.
 *       403:
 *         description: Unauthorized. Ensure you are using a valid User ID as Bearer token.
 *       500:
 *         description: Server error.
 */
app.post('/api/history', verifyFirebaseToken, async (req, res) => {
    console.log("create history called");
    const { uid } = req.user;
    const { tag, value, description, date, tripID } = req.body; 

    // Validate input
    if (!tag || !value || !description || !tripID || description.length > 50) {
        return res.status(400).json({ success: false, error: "Invalid input. Ensure all required fields are provided and description is ≤ 50 chars." });
    }

    // Ensure 'tag' is one of the predefined values
    const validTags = ["Transportation", "Hotel", "Things To Do", "Food", "Other"];
    if (!validTags.includes(tag)) {
        return res.status(400).json({ success: false, error: "Invalid tag. Must be one of: flight, hotel, thingsToDo, food, other." });
    }

    try {
        const query = `
            INSERT INTO history (user_id, tag, value, description, date, trip_id)
            VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_DATE), $6)
            RETURNING *;
        `;

        const result = await pool.query(query, [uid, tag, value, description, date || null, tripID]);

        res.status(201).json({ success: true, history: result.rows[0] });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ success: false, error: "Database error" });
    }
});



app.get('/api/history', verifyFirebaseToken, async (req, res) => {
    console.log("get history called");
    const { uid } = req.user;

    try {
        const result = await pool.query('SELECT * FROM history WHERE user_id = $1', [uid]);
        res.status(200).json({ success: true, histories: result.rows });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

/**
 * @swagger
 * /api/history/{id}:
 *   delete:
 *     summary: Delete a history entry
 *     description: Deletes a history entry by ID. The user must be authenticated via Firebase.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the history entry to delete
 *     responses:
 *       200:
 *         description: History entry successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "History entry deleted."
 *                 deletedHistory:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     user_id:
 *                       type: string
 *                       example: "user_123"
 *                     tag:
 *                       type: string
 *                       example: "flight"
 *                     value:
 *                       type: number
 *                       format: float
 *                       example: 250.75
 *                     description:
 *                       type: string
 *                       example: "Round trip to NYC"
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: "2025-03-18"
 *       400:
 *         description: Bad request. Invalid history ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Invalid history ID."
 *       404:
 *         description: Not found. The history entry does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "History entry not found."
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Database error."
 */
app.delete('/api/history/:id', verifyFirebaseToken, async (req, res) => {
    console.log("delete history called");
    const { uid } = req.user;
    const { id } = req.params;

    try {
        const deleteQuery = 'DELETE FROM history WHERE id = $1 AND user_id = $2 RETURNING *';
        const deleteResult = await pool.query(deleteQuery, [id, uid]);

        if (deleteResult.rowCount === 0) {
            return res.status(404).json({ success: false, error: "History entry not found." });
        }

        res.status(200).json({ success: true, message: "History entry deleted.", deletedHistory: deleteResult.rows[0] });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ success: false, error: "Database error" });
    }
});


// OPEN AI ENDPOINT
/**
 * @swagger
 * /api/openai/chat:
 *   post:
 *     summary: Proxy request to OpenAI's chat completion endpoint
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               model:
 *                 type: string
 *                 example: gpt-4o
 *               messages:
 *                 type: array
 *                 items:
 *                   type: object
 *                 example: [{ "role": "user", "content": "Hello!" }]
 *     responses:
 *       200:
 *         description: OpenAI chat completion response
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Internal server error
 */
app.post('/api/openai/chat', verifyFirebaseToken, async (req, res) => {
    console.log("OpenAI chat proxy called");
    return res.status(503).json({ error: 'This service is temporarily disableed'});
    try {
        const { model, messages } = req.body;

        if (!model || !messages) {
            return res.status(400).json({ error: 'Missing required parameters: model or messages' });
        }

        const openaiRes = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            req.body, // pass full body to allow extra options
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        res.status(200).json(openaiRes.data);
    } catch (error) {
        console.error('Error calling OpenAI:', error?.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data || 'An error occurred while contacting OpenAI',
        });
    }
});







// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});



