import express from 'express';
import { StatusCodes } from 'http-status-codes';
import AsyncErrorHandler from '../AsyncErrorHandler';
import UserController from '../controllers/UserController';
require('express-async-errors');

const router = express.Router();

router.post(
  '/users', async (req, res, next) =>
  await UserController.registerUser(req.body.pseudo, req.body.password, req.body.avatar)
    .then((r) => res.status(StatusCodes.CREATED).json(r))
    .catch((e) => res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e))
);

router.use((err, req, res, next) => AsyncErrorHandler.handleRestError(err, req, res, next));
export default router;
