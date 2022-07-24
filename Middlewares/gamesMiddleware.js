import {gameSchema} from '../Schemas/schemas.js';
import db from '../dbStrategy/db.js';

export function ValidaPostGames(req, res, next) {
	const validation = gameSchema.validate(req.body);
	if(validation.error) return res.status(400).send(validation.error.details);
	next();
}

export async function VerificaPostGames(req, res, next) {
	try {
		if(await HasGame(req.body.name)) return res.sendStatus(409);
		if(!(await HasCategory(req.body.categoryId))) return res.status(400).send("invalid category id");
		next();
	} catch (error) {
		return res.status(500).send("error");
	}
}

async function HasGame(name){
	try {
		const query = "SELECT * FROM games WHERE name = $1;";
		const {rows: game} = await db.query(query, [name]);
		if(game.length > 0) return true;
		else return false;
	} catch (error) {
		throw error;
	}
}

async function HasCategory(id){
	try {
		const query = "SELECT * FROM categories WHERE id = $1;";
		const {rows: category} = await db.query(query, [id]);
		if(category.length > 0) return true;
		else return false;
	} catch (error) {
		throw error;
	}
}