import db from '../dbStrategy/db.js';
import dayjs from 'dayjs';
// import { stripHtml } from "string-strip-html";

export async function GetRentals(req, res) {
	const { customerId, gameId } = req.query;
	try {
		const query = `
			SELECT
				r.*,
				c.id as "customerId", c.name as "customerName",
				g.id as "gameId", g.name as "gameName", g."categoryId",
				k.name as "categoryName"
			FROM rentals r
			JOIN customers c
			ON r."customerId" = c.id
			JOIN games g
			ON r."gameId" = g.id
			JOIN categories k
			ON g."categoryId" = k.id
		`;
		const {rows} = (customerId) ?
			await db.query(query + `WHERE r."customerId" = $1`, [customerId]) :
			(gameId) ?
			await db.query(query + `WHERE r."gameId" = $1`, [gameId]) :
			await db.query(query)
		;
		const rentals = rows.map(value => {
			const rental = {
				id: value.id,
				customerId: value.customerId,
				gameId: value.gameId,
				rentDate: dayjs(value.rentDate).format('YYYY-MM-DD'),
				daysRented: value.daysRented,
				returnDate: (value.returnDate) ? dayjs(value.returnDate).format('YYYY-MM-DD') : value.returnDate,
				originalPrice: value.originalPrice,
				delayFee: value.delayFee,
				customer: {
					id: value.customerId,
					name: value.customerName
				},
				game: {
					id: value.gameId,
					name: value.gameName,
					categoryId: value.categoryId,
					categoryName: value.categoryName
				}
			}
			return rental;
		});
		res.send(rentals);
	} catch (error) {
		return res.status(500).send(error);
	}
}

export async function PostRentals(req, res) {
	const rental = req.body;
	const pricePerDay = res.locals.pricePerDay;
	try {
		const query = `
			INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
			VALUES ($1, $2, $3, $4, null, $5, null);
		`;
		await db.query(query, [
			rental.customerId,
			rental.gameId,
			dayjs().format('YYYY-MM-DD'),
			rental.daysRented,
			rental.daysRented * pricePerDay
		]);
		res.sendStatus(201);
	} catch (error) {
		console.log(error)
		return res.status(500).send(error);
	}
}