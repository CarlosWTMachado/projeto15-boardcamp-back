import db from '../dbStrategy/db.js';
//import { stripHtml } from "string-strip-html";

export async function GetCategories(req, res) {
	const {offset, limit, order, desc} = req.query;
	try {
		let query = `
			SELECT *
			FROM categories
		`;
		let params = [];
		let count = 1;
		if(order) query += ` ORDER BY "${order}"` + ((desc === 'true') ? ` DESC` : ` ASC`);
		if(offset){
			query += ` OFFSET $${count}`;
			count++;
			params.push(offset);
		}
		if(limit){
			query += ` LIMIT $${count}`;
			count++;
			params.push(limit);
		}
		const {rows: categories} = await db.query(query, params);
		res.send(categories);
	} catch (error) {
		console.log(error)
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