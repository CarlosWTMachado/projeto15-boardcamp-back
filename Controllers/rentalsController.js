import db from '../dbStrategy/db.js';
import dayjs from 'dayjs';
//import { stripHtml } from "string-strip-html";

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
		/*
		const queryRentals = `
			SELECT *
			FROM rentals
		`;
		const {rows: rentals} = await db.query(queryRentals);
		const queryCustomer = `
			SELECT id, name
			FROM customers
			WHERE id = $1
		`;
		const customers = await Promise.all(
			rentals.map(async rental => {
				const {rows: customer} = await db.query(queryCustomer, [rental.customerId]);
				return {...rental, customer: customer[0]};
			})
		);
		const queryGames = `
			SELECT *
			FROM games
			WHERE id = $1
		`;
		const games = await Promise.all(
			rentals.map(async rental => {
				const {rows: game} = await db.query(queryGames, [rental.gameId]);
				return {...rental, game: game[0]};
			})
		);
		res.send({rentals, customers, games});
		*/
	} catch (error) {
		return res.status(500).send(error);
	}
}