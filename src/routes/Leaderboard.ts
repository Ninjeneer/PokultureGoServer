import express from 'express';
import { StatusCodes } from 'http-status-codes';
import ErrorHandler from '../ErrorHandler';
import LeaderboardController from '../controllers/LeaderboardController';
import UserController from '../controllers/UserController';
require('express-async-errors');

const router = express.Router();

router.get(
  '/leaderboard',
  async (req, res, next) => await UserController.checkToken(req, next),
  async (req, res, next) => {
    try {
      const leaderboard = await LeaderboardController.getLeaderboard(req.query.cities as string);
      res.status(StatusCodes.OK).send(leaderboard);
    } catch (e) {
      ErrorHandler.handleRestError(e, res, next);
    }
  }
);

export default router;
