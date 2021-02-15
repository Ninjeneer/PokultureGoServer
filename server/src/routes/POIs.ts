import express from 'express';
import { StatusCodes } from 'http-status-codes';
import ErrorHandler from '../ErrorHandler';
import POIController from '../controllers/POIController';
require('express-async-errors');

const router = express.Router();

router.get(
  '/pois/near', async (req, res, next) => {
    try {
      const pois = await POIController.handleGetPOIsAroundLocation(Number(req.query.longitude), Number(req.query.latitude), Number(req.query.range))
      res.status(StatusCodes.OK).send(pois);
    } catch (e) {
      ErrorHandler.handleRestError(e, res, next);
    }
  }
);

router.post(
  '/pois/import', async (req, res, next) => {
    try {
      await POIController.importPOIs();
      res.status(StatusCodes.OK).send();
    } catch (e) {
      ErrorHandler.handleRestError(e, res, next);
    }
  }
);

router.post(
  '/pois/descriptions/import', async (req, res, next) => {
    try {
      await POIController.importPOIsDescription();
      res.status(StatusCodes.OK).send();
    } catch (e) {
      ErrorHandler.handleRestError(e, res, next);
    }
  }
);
export default router;
