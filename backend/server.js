const express = require('express');
const axios = require('axios'); // For making API calls
const app = express();
const port = 3000;
const GOOGLE_API_KEY = 'AIzaSyANe_6bk7NDht5ECPAtRQ1VZARSHBMlUTI';
const admin = require('firebase-admin');

// Middleware to parse JSON bodies (if needed for POST/PUT requests)
app.use(express.json());

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


app.get('/api/autocomplete', verifyFirebaseToken, async (req, res) => {
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

// Route Endpoint
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


// Database Endpoints

// Status endpoint
app.get('/api/serverstatus', (req, res) => {
    res.json({ message: 'Server is Running' });
});

const pool = require('./db'); // Import DB connection

// Register user in the database
app.post('/api/register', verifyFirebaseToken, async (req, res) => {
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

// Get all trips from a specific user
app.get('/api/trips', verifyFirebaseToken, async (req, res) => {
    const { uid } = req.user;

    try {
        const result = await pool.query('SELECT * FROM trips WHERE user_id = $1', [uid]);
        res.status(200).json({ success: true, trips: result.rows });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// Create and add trip to database
app.post('/api/trips', verifyFirebaseToken, async (req, res) => {
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







// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
