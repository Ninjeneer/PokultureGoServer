import User, { IUser } from "../models/User";
import StatusCodes from 'http-status-codes'

export default class UserController {
    public static async registerUser(res, pseudo: IUser['pseudo'], password: IUser['password'], avatar: IUser['avatar']) {
        if (!pseudo || !password) {
            throw new Error("Missing field !");
        }
        try {
            let user = new User({ pseudo, password, avatar });
            user = await user.save();
            console.log(`User ${JSON.stringify(user)} registered`);

            delete user.password;
            res.status(StatusCodes.CREATED).send(user.id);
        } catch (e) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message);
        }
    }
}