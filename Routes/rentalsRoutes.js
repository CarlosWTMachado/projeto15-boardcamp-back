import express from 'express';
import {GetRentals, PostRentals, PostRentalsIdReturn, DeleteRentals} from '../Controllers/rentalsController.js';
import {ValidaPostRentals, VerificaPostRentals, VerificaPostRentalsIdReturn, VerificaDeleteRentals} from '../Middlewares/rentalsMiddleware.js';

const router = express.Router();

router.get('/rentals', GetRentals);
router.post('/rentals', ValidaPostRentals, VerificaPostRentals, PostRentals);
router.post('/rentals/:id/return', VerificaPostRentalsIdReturn, PostRentalsIdReturn);
router.delete('/rentals/:id', VerificaDeleteRentals, DeleteRentals);

export default router;