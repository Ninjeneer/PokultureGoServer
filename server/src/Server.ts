import bodyParser from 'body-parser';
import express from 'express';
import POIController from './controllers/POIController';
import Database from './Database';
import UserRouter from './routes/Users';
import POIRouter from './routes/POIs';
import ImportPOITask from './tasks/ImportPOITask';
import Task from './tasks/Task';
import Utils from './Utils';

export default class Server {
  private app: express.Express;
  private config = require('../assets/config.json');
  private db: Database;
  private tasks: Task[] = [];

  constructor() {
    this.app = express();
    this.app.use(bodyParser.json());
    this.db = new Database();

    this.tasks.push(new ImportPOITask());
  }

  private buildRoutes() {
    this.app.use(UserRouter);
    this.app.use(POIRouter);
  }

  private runTasks() {
    console.log("==> Running tasks");
    this.tasks.forEach((t) => t.run());
  }

  public start() {
    console.log("lol")
    this.buildRoutes();

    const port = this.config ? this.config.port : 8080;
    this.db.connect().then(() => {
      this.runTasks();
      this.app.listen(port, () => console.log(`Server listening on port ${port}`));
    }).catch((e) => {
      console.log(e);
    });
  }
}
