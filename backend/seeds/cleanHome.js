import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://nuhdemirdev:4pV1QM1OxNSYpwNG@cluster0.sasdnqp.mongodb.net/carsi?retryWrites=true&w=majority";

const cleanOldData = async () => {
    await mongoose.connect(MONGO_URI);
    await mongoose.connection.collection('deals').deleteMany({});
    await mongoose.connection.collection('testimonials').deleteMany({});
    await mongoose.connection.collection('campaigns').deleteMany({});
    await mongoose.connection.collection('brands').deleteMany({});
    console.log("Old home data cleaned.");
    process.exit(0);
};
cleanOldData();
