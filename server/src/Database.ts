import mongoose from 'mongoose';
import mongodb from 'mongodb'
import sanitize from 'mongo-sanitize'

export default class Database {
    private static client;

    public static getClient(): mongodb.Db {
        return Database.client;
    }

    public async connect() {
        return new Promise((resolve, error) => {
            mongoose.set('useCreateIndex', 'true');
            mongoose.connect('mongodb://localhost/pokulturego', { useNewUrlParser: true, useUnifiedTopology: true })
            .then((client) => {
                console.log("Connected to database");
                Database.client = mongoose.connection.db;
                resolve(null);
            })
            .catch((e) => error(e));
        });
    }

    public static sanitizeObject(o: any) {
        if (typeof o === "object") {
            for (const key of Object.keys(o)) {
                if (typeof o[key] === "object") {
                    Database.sanitizeObject(o[key]);
                } else {
                    if (key.indexOf('.') === -1 && key.indexOf('$') === -1) {
                        const value = sanitize(o[key]);
                        delete o[key];
                        Object.assign(o, { [sanitize(key)]: value })
                    } else {
                        delete o[key];
                    }
                }
            }
        } else {
            o = sanitize(o);
        }
    }
}