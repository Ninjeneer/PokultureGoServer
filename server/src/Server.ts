import express from 'express';

export default class Server {
    private app: express.Express;
    private config = require('../assets/config.json');
    
    constructor() {
        this.app = express();
    }

    public start() {
        const port = this.config ? this.config.port : 8080;
        this.app.listen(port, () => console.log(`Server listening on port ${port}`));
    }
}