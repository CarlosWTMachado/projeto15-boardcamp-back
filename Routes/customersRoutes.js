import express from 'express';
import {GetCustomers, GetCustomersById, PostCustomers, PutCustomersById} from '../Controllers/customersController.js';
import {ValidateCustomers, VerifyCustomers} from '../Middlewares/customersMiddleware.js';

const router = express.Router();

router.get('/customers', GetCustomers);
router.get('/customers/:id', GetCustomersById);
router.post('/customers', ValidateCustomers, VerifyCustomers, PostCustomers);
router.put('/customers/:id', ValidateCustomers, VerifyCustomers, PutCustomersById);

export default router;