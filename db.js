const mongoURL = "mongodb+srv://myappdbfomaatlas:Faisal%402020@clusterfirstmernfoma.hniygfb.mongodb.net/?retryWrites=true&w=majority&appName=ClusterFirstMernFoma";

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
