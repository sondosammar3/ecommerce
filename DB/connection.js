import mongoose from "mongoose";

const connectDB = async () => {
  return await mongoose.connect("mongodb+srv://sondosammar:sondos123@cluster0.qbaoca5.mongodb.net/ecommerce").then(() => {
    console.log("connected successfully");
  }).catch((err) => {
    console.log(`error to connect db ${err}`);
  });
};

export default connectDB;
