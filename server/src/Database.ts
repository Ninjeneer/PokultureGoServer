import mongoose from 'mongoose';

export default class Database {
    private mongoClient;

    public async connect() {
        return new Promise((resolve, error) => {
            mongoose.set('useCreateIndex', 'true');
            mongoose.connect('mongodb://localhost/pokulturego', { useNewUrlParser: true, useUnifiedTopology: true })
            .then((client) => {
                console.log("Connected to database");
                this.mongoClient = client;
                resolve(null);
            })
            .catch((e) => error(e));
        });
    }
}