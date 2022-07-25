import db from '../dbStrategy/db.js';
//import { stripHtml } from "string-strip-html";

export async function GetGames(req, res) {
	const {name, offset, limit} = req.query;
	try {
		let query = `
			SELECT g.*, c.id as "categoryId", c.name as "categoryName"
			FROM (games g
			JOIN categories c
			ON g."categoryId"=c.id)
		`;
		let params = [];
		let count = 1;
		if(name){
			query += `WHERE LOWER(g.name) LIKE $${count}`;
			count++;
			params.push(name.toLowerCase()+"%");
		}
		if(offset){
			query += `OFFSET $${count}`;
			count++;
			params.push(offset);
		}
		if(limit){
			query += `LIMIT $${count}`;
			count++;
			params.push(limit);
		}
		const {rows: games} = await db.query(query, params);
		res.send(games);
	} catch (error) {
		console.log(error)
		return res.status(500).send(error);
	}
}

export async function PostGames(req, res) {
	const game = req.body;
	try {
		const query = `
			INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") 
			VALUES ($1, $2, $3, $4, $5);
		`;
		await db.query(query, [game.name, game.image, game.stockTotal, game.categoryId, game.pricePerDay]);
		res.sendStatus(201);
	} catch (error) {
		return res.status(500).send("error");
	}
}