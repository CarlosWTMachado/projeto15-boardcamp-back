import db from '../dbStrategy/db.js';

export async function GetCategories(_, res) {
	try {
		const {rows: categories} = await db.query('SELECT * FROM categories');
		res.send(categories);
	} catch (error) {
		return res.status(500).send(error);
	}
}

export async function PostCategories(req, res) {
	const {name} = req.body;
	try {
		await db.query(`INSERT INTO categories (name) VALUES ($1);`, [name]);
		res.sendStatus(201);
	} catch (error) {
		return res.status(500).send(error);
	}
}