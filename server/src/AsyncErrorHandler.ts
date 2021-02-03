export default class AsyncErrorHandler {
  public static handleRestError(err: Error, req, res, next) {
    if (!err) {
      return next();
    }
    console.log("lol")
    res.status(500).send(err);
  }
}
