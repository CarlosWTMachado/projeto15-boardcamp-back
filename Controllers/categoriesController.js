import db from '../dbStrategy/db.js';
//import { stripHtml } from "string-strip-html";

export async function GetCategories(_, res) {
	try {
		const query = `
			SELECT *
			FROM categories;
		`;
		const {rows: categories} = await db.query(query);
		res.send(categories);
	} catch (error) {
		return res.status(500).send(error);
	}
}

export async function PostCategories(req, res) {
	const {name} = req.body;
	try {
		const query = `
			INSERT INTO categories (name)
			VALUES ($1);
		`;
		await db.query(query, [name]);
		res.sendStatus(201);
	} catch (error) {
		return res.status(500).send(error);
	}
}