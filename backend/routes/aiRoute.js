import express from 'express';
import { chat } from '../controllers/aiController.js';
import authUser from '../middleware/auth.js';

const aiRouter = express.Router();

// Route for asking the AI chatbot
aiRouter.post('/chat', chat);

export default aiRouter;
