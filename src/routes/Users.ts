import express from 'express';
import { StatusCodes } from 'http-status-codes';
import ErrorHandler from '../ErrorHandler';
import UserController from '../controllers/UserController';
import UserStorage from '../storage/UserStorage';
require('express-async-errors');

const router = express.Router();

router.post(
  '/users/register', async (req, res, next) => {
    try {
      const user = await UserController.registerUser(req.body.pseudo, req.body.password, req.body.avatar)
      res.status(StatusCodes.CREATED).send(user);
    } catch (e) {
      ErrorHandler.handleRestError(e, res, next);
    }
  }
);

router.post(
  '/users/login', async (req, res, next) => {
    try {
      const user = await UserController.loginUser(req.body.pseudo, req.body.password, req.body.token)
      res.status(StatusCodes.OK).send(user);
    } catch (e) {
      ErrorHandler.handleRestError(e, res, next);
    }
  }
);

router.get(
  '/users', async (req, res, next) => {
    try {
      const user = await UserStorage.getUsers()
      res.status(StatusCodes.OK).send(user);
    } catch (e) {
      ErrorHandler.handleRestError(e, res, next);
    }
  }
);

export default router;
