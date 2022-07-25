import express, { json } from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import CategoriesRouter from './Routes/categoriesRoutes.js';
import GamesRouter from './Routes/gamesRoutes.js';
import CustomersRouter from './Routes/customersRoutes.js';

dotenv.config();
const server = express();
server.use(cors());
server.use(json());

server.use(CategoriesRouter);
server.use(GamesRouter);
server.use(CustomersRouter);

server.listen(process.env.PORT, () => {
	console.log("Rodando ...");
});