import express from 'express';
import { upload } from '../middleware/upload.js';
import { importCSV, getImportHistory } from '../controllers/importController.js';

const router = express.Router();

// POST /import/:entity - Upload and import CSV
router.post('/:entity', upload.single('csvFile'), importCSV);

// GET /import/history - Get import history and sample formats
router.get('/history', getImportHistory);

export default router;
