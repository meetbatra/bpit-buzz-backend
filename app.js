import express from 'express';
import chalk from 'chalk';
import cors from 'cors';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import { createConnection } from './utils/db/connection.js';
import { Error404 } from './utils/middlewares/404.js';
import indexRoute from "./api/v1/routes/index.js";

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(fileUpload({limits :{fileSize: 5 * 1024 * 1024} }));

app.use('/api/v1', indexRoute);
app.use(Error404);

const promise = createConnection();
promise.then(() => {
    console.log(chalk.greenBright.bold('Connected to db'));
    app.listen(8080, (err) => {
        if(err){
            console.log(chalk.redBright('Server crash:'),err);
        } else {
            console.log(chalk.greenBright.bold('Server is listening at port 8080'));
        }
    });
});