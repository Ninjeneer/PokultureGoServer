import { IScore } from "../models/User";
import UserStorage from "../storage/UserStorage";

export default class LeaderboardController {
  public static async getLeaderboard(city?: string) {
    const usersScores = await UserStorage.getUsersScores({ city: city });

    if (city) {
      for (const user of usersScores) {
        // Locally delete every other scores to process sorting
        for (const score of user.scores) {
          if (score.city === city) {
            user.scores = [score];
            break;
          }
        }
      }
      usersScores.sort((u1, u2) => u1.scores[0].score > u2.scores[0].score ? -1 : (u1.scores[0].score === u2.scores[0].score ? 1 : 0));
    } else {
      usersScores.sort((u1, u2) => this.sumUserScore(u1.scores) > this.sumUserScore(u2.scores) ? -1 : (this.sumUserScore(u1.scores) === this.sumUserScore(u2.scores) ? 1 : 0));
    }
    return usersScores;
  }

  private static sumUserScore(scores: IScore[]): number {
    let sum = 0;
    scores.forEach((s) => sum += s.score);
    return sum;
  }
}
