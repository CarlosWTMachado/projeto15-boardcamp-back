import db from '../dbStrategy/db.js';
import dayjs from 'dayjs';
// import { stripHtml } from "string-strip-html";

export async function GetRentals(req, res) {
	const {customerId, gameId, offset, limit, order, desc, status, startDate} = req.query;
	try {
		let query = `
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
		let params = [];
		let count = 1;
		if(customerId){
			query += `WHERE r."customerId" = $${count}`;
			count++;
			params.push(customerId);
			if(gameId){
				query += ` AND r."gameId" = $${count}`;
				count++;
				params.push(gameId);
			}
			if(status === 'open') query += ` AND r."returnDate" is NULL`;
			else if(status === 'close') query += ` AND r."returnDate" is not NULL`;
			if(startDate){
				query += ` AND "rentDate" >= $${count}`;
				count++;
				params.push(startDate);
			}
		}else if(gameId){
			query += `WHERE r."gameId" = $${count}`;
			count++;
			params.push(gameId);
			if(status === 'open') query += ` AND r."returnDate" is NULL`;
			else if(status === 'close') query += ` AND r."returnDate" is not NULL`;
			if(startDate){
				query += ` AND "rentDate" >= $${count}`;
				count++;
				params.push(startDate);
			}
		}else if(startDate){
			query += `WHERE "rentDate" >= $${count}`;
			count++;
			params.push(startDate);
			if(status === 'open') query += ` AND r."returnDate" is NULL`;
			else if(status === 'close') query += ` AND r."returnDate" is not NULL`;
		}else{
			if(status === 'open') query += ` WHERE r."returnDate" is NULL`;
			else if(status === 'close') query += ` WHERE r."returnDate" is not NULL`;
		}
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
		const {rows} = await db.query(query, params);
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
		console.log(error)
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
		return res.status(500).send(error);
	}
}

export async function PostRentalsIdReturn(req, res) {
	const {id} = req.params;
	const delayFee = getDelayFee(res.locals);
	console.log(delayFee)
	try {
		const query = `
			UPDATE rentals
			SET "returnDate" = $1, "delayFee" = $2
			WHERE id = $3
		`;
		await db.query(query, [
			dayjs().format('YYYY-MM-DD'),
			delayFee,
			id
		]);
		res.sendStatus(200);
	} catch (error) {
		return res.status(500).send(error);
	}
}

function getDelayFee({rentDate, daysRented, pricePerDay}){
	const returnDate = dayjs(rentDate).add(daysRented, 'day').format('YYYY-MM-DD');
	const delayDays = dayjs().diff(dayjs(returnDate), 'day');
	return (delayDays > 0) ? delayDays * pricePerDay : 0;
}

export async function DeleteRentals(req, res) {
	const {id} = req.params;
	try {
		const query = `
			DELETE FROM rentals
			WHERE id = $1
		`;
		await db.query(query, [id]);
		res.sendStatus(200);
	} catch (error) {
		return res.status(500).send(error);
	}
}