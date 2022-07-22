import express from 'express';
import {GetCategories, PostCategories} from '../Controllers/categoriesController.js';
import {ValidaPostCategories, VerificaPostCategories} from '../Middlewares/categoriesMiddleware.js';

const router = express.Router();

router.get('/categories', GetCategories);
router.post('/categories', ValidaPostCategories, VerificaPostCategories, PostCategories);

export default router;