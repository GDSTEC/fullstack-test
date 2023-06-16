import { Request, Response } from "express";
import { IUserModel } from "../../models/user/interfaceIUserModel";
import User from "../../models/user/User";
import bCrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: "./src/.env" });

export default {
  async login(req: Request, res: Response) {
    try {
      const { userEmail, userPassword }: IUserModel = req.body;

      if (!userEmail || !userPassword) {
        return res.status(400).send({ message: "Preencha os campos corretamente" });
      }
      const userAlreadyExists = await User.findOne<Promise<IUserModel>>({ userEmail });
      if (userEmail !== userAlreadyExists?.userEmail) {
        return res.status(401).send({ message: "Email ou senha incorretos!" });
      }

      if (!userAlreadyExists) {
        return res.status(400).send({ message: "Usuário não encontrado" });
      }

      const validPassword = await bCrypt.compare(userPassword, userAlreadyExists?.userPassword);

      if (!validPassword) {
        return res.status(400).send({ message: "Email ou senha incorretos!" });
      }

      const token = jwt.sign(
        {
          email: userAlreadyExists,
        },
        process.env.JWT_KEY!,
        {
          expiresIn: "48h",
        }
      );

      return res.send({
        userEmail: userAlreadyExists?.userEmail,
        _id: userAlreadyExists?._id,
        userName: userAlreadyExists?.userName,
        token: token,
      })
    } catch (error) {
      return res.status(500).send({ message: "Internal server error", error });
    }
  },
};
