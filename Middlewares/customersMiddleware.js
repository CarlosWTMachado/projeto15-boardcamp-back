import {customerSchema} from '../Schemas/schemas.js';
import db from '../dbStrategy/db.js';

export function ValidatePostCustomers(req, res, next) {
	const validation = customerSchema.validate(req.body);
	if(validation.error) return res.status(400).send(validation.error.details);
	next();
}

export async function VerifyPostCustomers(req, res, next) {
	try {
		if(await HasCustomer(req.body.cpf)) return res.sendStatus(409);
		next();
	} catch (error) {
		return res.status(500).send(error);
	}
}

async function HasCustomer(cpf){
	try {
		const query = "SELECT * FROM customers WHERE cpf = $1;";
		const {rows: customer} = await db.query(query, [cpf]);
		if(customer.length > 0) return true;
		else return false;
	} catch (error) {
		throw error;
	}
}