import express from 'express';
import {GetCustomers, GetCustomersById, PostCustomers, PutCustomersById} from '../Controllers/customersController.js';
import {ValidatePostCustomers, VerifyPostCustomers} from '../Middlewares/customersMiddleware.js';

const router = express.Router();

router.get('/customers', GetCustomers);
router.get('/customers/:id', GetCustomersById);
router.post('/customers', ValidatePostCustomers, VerifyPostCustomers, PostCustomers);
router.put('/customers/:id', ValidatePostCustomers, VerifyPostCustomers, PutCustomersById);

export default router;