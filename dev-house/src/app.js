import express from 'express';
import routes from './routes';
import mongoose from 'mongoose';

import dotenv from 'dotenv';
dotenv.config();

class App {

    constructor() {
        this.server = express();

        // MongoDB connection
        mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@devhouse.84ucmpy.mongodb.net/devhouse?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(express.json());
    }

    routes() {
        this.server.use(routes);
    }
}

export default new App().server;