import express from 'express';
import {GetCategories, PostCategories} from '../Controllers/categoriesController.js';
//import {} from '../middlewares/categoriesMiddleware.js';

const router = express.Router();

router.get('/categories', GetCategories);
router.post('/categories', PostCategories);

export default router;