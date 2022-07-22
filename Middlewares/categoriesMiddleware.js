import joi from 'joi';
import db from '../dbStrategy/db.js';

export function ValidaPostCategories(req, res, next) {
	const schema = joi.object({
		name: joi.string().required()
	});
	const validation = schema.validate({name: req.body.name});
	if(validation.error) return res.status(400).send(validation.error.details);
	next();
}

export async function VerificaPostCategories(req, res, next) {
	try {
		const {rows: category} = await db.query("SELECT * FROM categories WHERE name = $1;", [req.body.name]);
		if(category.length > 0) return res.sendStatus(409);
		next();
	} catch (error) {
		return res.status(500).send("error");
	}
}