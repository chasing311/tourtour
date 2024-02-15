const mongoose = require('mongoose');

exports.connectDB = function () {
    const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
    console.log(DB);

    mongoose
        .connect(DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        })
        .then(() => console.log('DB connection successful! 🏆'));
}

exports.connectLocalDB = function () {
    const DB = process.env.LOCAL_DATABASE;
    console.log(DB);

    mongoose
        .connect(DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            user: process.env.LOCAL_DATABASE_USER,
            pass: process.env.LOCAL_DATABASE_PASSWORD,
            dbName: "tourtour"
        })
        .then(() => console.log('DB connection successful! 🏆'));
}