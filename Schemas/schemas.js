import joi from 'joi';

const categorySchema = joi.object({
	name: joi.string().trim().required()
});

const gameSchema = joi.object({
	name: joi.string().required(),
	image: joi.string().required(),
	stockTotal: joi.number().greater(0).required(),
	categoryId: joi.number().required(),
	pricePerDay: joi.number().greater(0).required()
});

const customerSchema = joi.object({
	name: joi.string().required(),
	phone: joi.string().pattern(/^[0-9]{10,11}$/).required(),
	cpf: joi.string().pattern(/^[0-9]{11}$/).required(),
	birthday: joi.string().isoDate().required()
});

const rentalSchema = joi.object({
	customerId: joi.number().required(),
	gameId: joi.number().required(),
	daysRented: joi.number().greater(0).required()
});

export {categorySchema, gameSchema, customerSchema, rentalSchema};