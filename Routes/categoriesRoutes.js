import express from 'express';
import {GetCategories, PostCategories} from '../Controllers/categoriesController.js';
import {ValidateCategories, VerifyCategories} from '../Middlewares/categoriesMiddleware.js';

const router = express.Router();

router.get('/categories', GetCategories);
router.post('/categories', ValidateCategories, VerifyCategories, PostCategories);

export default router;