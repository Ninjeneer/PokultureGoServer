export default class AsyncErrorHandler {
	public static handleRestError(err: Error, req, res, next) {
		if (!err) {
			return next();
		}
		res.status(500).send(err);
	}
}
