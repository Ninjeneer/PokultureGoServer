import express from 'express';
import { StatusCodes } from 'http-status-codes';
import ErrorHandler from '../ErrorHandler';
import UserController from '../controllers/UserController';
require('express-async-errors');

const router = express.Router();

router.post(
  '/users', async (req, res, next) => {
    try {
      const user = await UserController.registerUser(req.body.pseudo, req.body.password, req.body.avatar)
      res.status(StatusCodes.CREATED).send(user);
    } catch (e) {
      ErrorHandler.handleRestError(e, res, next);
    }
  }
);

export default router;
