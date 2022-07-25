import db from '../dbStrategy/db.js';
//import { stripHtml } from "string-strip-html";

export async function GetCustomers(req, res) {
	const { cpf } = req.query;
	try {
		const query = `
			SELECT *
			FROM customers
		`;
		const {rows: customers} = (!cpf) ? 
			await db.query(query) :
			await db.query(query + `WHERE LOWER(cpf) LIKE $1;`, [cpf+"%"])
		;
		res.send(customers);
	} catch (error) {
		return res.status(500).send(error);
	}
}

export async function GetCustomersById(req, res) {
	const { id } = req.params;
	try {
		const query = `
			SELECT *
			FROM customers
			WHERE id = $1
		`;
		const {rows: customer} = await db.query(query, [id]);
		(customer.length < 1) ?
		res.sendStatus(404) :
		res.send(customer[0]);
	} catch (error) {
		return res.status(500).send(error);
	}
}

export async function PostCustomers(req, res) {
	const customer = req.body;
	console.log(customer)
	try {
		const query = `
			INSERT INTO customers (name, phone, cpf, birthday)
			VALUES ($1, $2, $3, $4);
		`;
		await db.query(query, [customer.name, customer.phone, customer.cpf, customer.birthday]);
		res.sendStatus(201);
	} catch (error) {
		return res.status(500).send(error);
	}
}

export async function PutCustomersById(req, res) {
	const {id} = req.params;
	const customer = req.body;
	try {
		const query = `
			UPDATE customers
			SET name = $1, phone = $2, cpf = $3, birthday = $4
			WHERE id = $5
		`;
		await db.query(query, [customer.name, customer.phone, customer.cpf, customer.birthday, id]);
		res.sendStatus(200);
	} catch (error) {
		return res.status(500).send(error);
	}
}