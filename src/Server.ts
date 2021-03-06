import bodyParser from 'body-parser';
import express from 'express';
import Database from './Database';
import UserRouter from './routes/Users';
import POIRouter from './routes/POIs';
import ChallengeRouter from './routes/Challenges';
import LeaderboardRouter from './routes/Leaderboard';
import ImportPOITask from './tasks/ImportPOITask';
import Task from './tasks/Task';
import AddPOIDescriptionTask from './tasks/AddPOIDescriptionTask';
import AddPhotoChallengesSynonyms from './tasks/AddPhotoChallengesSynonyms';

export default class Server {
  private app: express.Express;
  private config = require('../assets/config.json');
  private db: Database;

  private preStartTasks: Task[] = [];
  private tasks: Task[] = [];

  constructor() {
    this.app = express();
    this.app.use(bodyParser({ limit: '50mb'}));
    this.db = new Database();

    this.preStartTasks.push(new ImportPOITask(), new AddPOIDescriptionTask(), new AddPhotoChallengesSynonyms());
  }

  private buildRoutes() {
    this.app.use(UserRouter);
    this.app.use(POIRouter);
    this.app.use(ChallengeRouter);
    this.app.use(LeaderboardRouter);
  }

  private async runPreStartTasks() {
    console.log("\nRunning pre-start tasks...");
    for (const task of this.preStartTasks) {
      if (!(await task.canRun())) {
        console.log(`Task [${task.getName()}] skipped.`);
        continue;
      }

      await task.run();
    }
  }

  private runTasks() {
    this.tasks.forEach((t) => t.run());
  }

  public start() {
    this.buildRoutes();

    const port = this.config ? this.config.port : 8080;
    this.db.connect().then(() => {
      this.runPreStartTasks().then(() => this.app.listen(port, () => console.log(`\nServer listening on port ${port}`)));
    }).catch((e) => {
      console.log(e);
    });
  }
}
