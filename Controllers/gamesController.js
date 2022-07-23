import db from '../dbStrategy/db.js';
//import { stripHtml } from "string-strip-html";

export async function GetGames(req, res) {
	const { name } = req.query;
	try {
		const query = `
			SELECT g.*, c.id as "categoryId", c.name as "categoryName"
			FROM (games g
			JOIN categories c
			ON g."categoryId"=c.id)
		`;
		const {rows: games} = (!name) ?
			await db.query(query) :
			await db.query(query + `WHERE LOWER(g.name) LIKE $1;`, [name.toLowerCase()+"%"])
		;
		res.send(games);
	} catch (error) {
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