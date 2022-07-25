import {rentalSchema} from '../Schemas/schemas.js';
import db from '../dbStrategy/db.js';

export function ValidaPostRentals(req, res, next) {
	const validation = rentalSchema.validate(req.body);
	if(validation.error) return res.status(400).send(validation.error.details);
	next();
}

export async function VerificaPostRentals(req, res, next) {
	try {
		if(! await HasCustomer(req.body.customerId)) return res.sendStatus(400);
		if(! await HasGame(req.body.gameId)) return res.sendStatus(400);
		const pricePerDay = await HasStockGame(req.body.gameId);
		if(! pricePerDay) return res.sendStatus(400);
		res.locals.pricePerDay = pricePerDay;
		next();
	} catch (error) {
		return res.status(500).send("error");
	}
}

async function HasCustomer(id){
	try {
		const query = "SELECT * FROM customers WHERE id = $1;";
		const {rows: customer} = await db.query(query, [id]);
		if(customer.length > 0) return true;
		else return false;
	} catch (error) {
		throw error;
	}
}

async function HasGame(id){
	try {
		const query = "SELECT * FROM games WHERE id = $1;";
		const {rows: game} = await db.query(query, [id]);
		if(game.length > 0) return true;
		else return false;
	} catch (error) {
		throw error;
	}
}

async function HasStockGame(id){
	try {
		const queryGames = "SELECT * FROM games WHERE id = $1;";
		const {rows: games} = await db.query(queryGames, [id]);
		const queryRentals = `SELECT * FROM rentals WHERE "gameId" = $1`;
		const {rows: rentals} = await db.query(queryRentals, [id]);
		if(games[0].stockTotal > rentals.length) return games[0].pricePerDay;
		else return false;
	} catch (error) {
		throw error;
	}
}

export async function VerificaPostRentalsIdReturn(req, res, next) {
	try {
		const {returnDate, rentDate, daysRented, pricePerDay} = await HasRental(req.params.id);
		if(! returnDate){
			if(returnDate === null) {
				res.locals.rentDate = rentDate;
				res.locals.daysRented = daysRented;
				res.locals.pricePerDay = pricePerDay;
				next();
			}
			else return res.sendStatus(404);
		}else return res.sendStatus(400);
	} catch (error) {
		return res.status(500).send("error");
	}
}

async function HasRental(id){
	try {
		const query = `
			SELECT r.*, g."pricePerDay"
			FROM rentals r
			JOIN games g
			ON r."gameId" = g.id
			WHERE r.id = $1;
		`;
		const {rows: rental} = await db.query(query, [id]);
		if(rental.length > 0) return {
			returnDate: rental[0].returnDate, 
			rentDate: rental[0].rentDate,
			daysRented: rental[0].daysRented,
			pricePerDay: rental[0].pricePerDay
		};
		else return false;
	} catch (error) {
		throw error;
	}
}

export async function VerificaDeleteRentals(req, res, next) {
	try {
		const rental = await HasRentals(req.params.id)
		if(! await HasRentals(req.params.id)){
			if(rental === null) next();
			else return res.sendStatus(404);
		}else return res.sendStatus(400);
	} catch (error) {
		return res.status(500).send("error");
	}
}

async function HasRentals(id){
	try {
		const query = "SELECT * FROM rentals WHERE id = $1;";
		const {rows: rental} = await db.query(query, [id]);
		if(rental.length > 0) return rental[0].returnDate;
		else return false;
	} catch (error) {
		throw error;
	}
}