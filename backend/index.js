import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fs from 'fs'
import importRoutes from './routes/import.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Procurement Input Module API',
    version: '1.0.0',
    endpoints: {
      import: '/import/:entity (POST)',
      history: '/import/history (GET)'
    }
  });
});

// Import routes
app.use('/import', importRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: error.message
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
