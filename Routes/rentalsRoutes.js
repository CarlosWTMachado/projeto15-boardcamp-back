import express from 'express';
import {GetRentals, PostRentals, PostRentalsIdReturn, DeleteRentals} from '../Controllers/rentalsController.js';
import {ValidateRentals, VerifiyRentals, VerifyRentalsIdReturn, VerifyDeleteRentals} from '../Middlewares/rentalsMiddleware.js';

const router = express.Router();

router.get('/rentals', GetRentals);
router.post('/rentals', ValidateRentals, VerifiyRentals, PostRentals);
router.post('/rentals/:id/return', VerifyRentalsIdReturn, PostRentalsIdReturn);
router.delete('/rentals/:id', VerifyDeleteRentals, DeleteRentals);

export default router;