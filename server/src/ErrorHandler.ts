import { StatusCodes } from "http-status-codes";
import { AppError } from "./Types";

export default class ErrorHandler {
  public static handleRestError(err, res, next) {
    if (!err) {
      return next();
    }

    console.error(err);
    res.status(err.code ? err.code : StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: err.message,
      stack: err.stack
    });
  }
}
