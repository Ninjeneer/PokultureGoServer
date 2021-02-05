import express from 'express';
import { StatusCodes } from 'http-status-codes';
import AsyncErrorHandler from '../AsyncErrorHandler';
import POIController from '../controllers/POIController';
require('express-async-errors');

const router = express.Router();

router.get(
  '/pois/near', async (req, res, next) =>
  await POIController.handleGetPOIsAroundLocation(req.query.longitude, req.query.latitude, req.query.range)
    .then((r) => res.status(StatusCodes.OK).json(r))
    .catch((e) => res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e))
);

router.post(
  '/pois/import', async (req, res, next) =>
  await POIController.importPOIs()
    .then((r) => res.status(StatusCodes.OK).json(r))
    .catch((e) => res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e))
);

router.post(
  '/pois/descriptions/import', async (req, res, next) =>
  await POIController.importPOIsDescription()
    .then((r) => res.status(StatusCodes.OK).json(r))
    .catch((e) => res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e))
);

router.use((err, req, res, next) => AsyncErrorHandler.handleRestError(err, req, res, next));
export default router;