import bodyParser from 'body-parser';
import express from 'express';
import Database from './Database';
import User from './models/User';
import UserRouter from './routes/Users';

export default class Server {
    private app: express.Express;
    private config = require('../assets/config.json');
    private db: Database;
    
    constructor() {
        this.app = express();
        this.app.use(bodyParser.json());
        this.db = new Database();
    }

    private buildRoutes() {
        this.app.use(UserRouter);
    }

    public start() {
        this.buildRoutes();

        const port = this.config ? this.config.port : 8080;
        this.db.connect().then(() => {
            this.app.listen(port, () => console.log(`Server listening on port ${port}`));
        }).catch((e) => {
            console.log(e);
        });
    }
}