import express from 'express';
import {GetRentals} from '../Controllers/rentalsController.js';
//import {} from '../Middlewares/customersMiddleware.js';

const router = express.Router();

router.get('/rentals', GetRentals);

export default router;