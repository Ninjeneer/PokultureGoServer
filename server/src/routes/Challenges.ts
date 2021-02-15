import express from 'express';
import { StatusCodes } from 'http-status-codes';
import ErrorHandler from '../ErrorHandler';
import ChallengeController from '../controllers/ChallengeController';
require('express-async-errors');

const router = express.Router();

router.post(
  '/challenges/validate', async (req, res, next) => {
    try {
      const validated = await ChallengeController.validateChallenge(req.body.id, req.body.payload);
      res.status(StatusCodes.OK).send(validated);
    } catch (e) {
      ErrorHandler.handleRestError(e, res, next);
    }
  }
);
export default router;
