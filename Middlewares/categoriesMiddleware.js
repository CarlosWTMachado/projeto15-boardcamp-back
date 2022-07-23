import {categorySchema} from '../Schemas/schemas.js';
import db from '../dbStrategy/db.js';

export function ValidaPostCategories(req, res, next) {
	const validation = categorySchema.validate({name: req.body.name});
	if(validation.error) return res.status(400).send(validation.error.details);
	next();
}

export async function VerificaPostCategories(req, res, next) {
	try {
		const query = "SELECT * FROM categories WHERE name = $1;";
		const {rows: category} = await db.query(query, [req.body.name]);
		if(category.length > 0) return res.sendStatus(409);
		next();
	} catch (error) {
		return res.status(500).send("error");
	}
}