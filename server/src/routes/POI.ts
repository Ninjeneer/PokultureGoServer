import express from 'express';
import AsyncErrorHandler from '../AsyncErrorHandler';
import UserController from '../controllers/UserController';

const router = express.Router();

router.post('/users', async (req, res, next) => await UserController.registerUser(res, req.body.pseudo, req.body.password, req.body.avatar));

router.use((err, req, res, next) => AsyncErrorHandler.handleRestError(err, req, res, next));
export default router;