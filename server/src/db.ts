import { Request, Response } from "express";
import mongoose from "mongoose";
import app from "./index";

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);

  await mongoose
    .connect(process.env.DB_URI!)
    .then(() => console.log("Connected to DB"))
    .catch((err: any) => console.error("Could not connect", err));
  } catch (error) {
    console.error("Erro no db.ts", error);
  }

//   app.use((err: Error, req: Request, res: Response) => {
//     if (err instanceof Error) {
//        return res.status(500).send({
//       status: "error",
//       message: `Internal server error - ${err}`,
//     });
//     }
//   });
};

export default connectDB;
