const mongoURL = "mongodb://127.0.0.1:27017/myappdb";

const mongoose = require('mongoose');

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURL);
        console.log("Congratulations Boss ,I am Connected to Mongo");
    } catch (error) {
        console.error("MongoDB connection error: ",error.message);
    }
};
module.exports=connectToMongo;