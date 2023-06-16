import User from "../../models/user/User";
import bCrypt from "bcrypt";
import { Request, Response } from "express";
import { IUserModel } from "../../models/user/interfaceIUserModel";

const hashPassword = async (userPassword: string) => {
  try {
    const salt = await bCrypt.genSalt(10);
    const encryptedPassword = await bCrypt.hash(userPassword, salt);
    return encryptedPassword;
  } catch (err) {
    return console.error(err);
  }
};

export default {
  async register(req: Request, res: Response) {
    try {
      const { userName, userEmail, userPassword }: IUserModel = req.body;

      let email = userEmail.trim();
      let password = userPassword.replace(/\s/g, "");
      const specialCharactersRegex: RegExp = /[!@#$%^&*(),.?":{}|<>]/;
      
      if (/\d/.test(userName) || specialCharactersRegex.test(userName) || userName.length < 2) {
        return res.status(400).send({ message: 'Insira um nome válido' });
      };
      
      if (password.length < 8 && password.length > 0) {
        return res.status(400).send({ message: "A senha deve ter mais de 8 caracteres" });
      };

      if (!userName || !email || !password) {
        return res.status(400).send({ message: "Por favor preencha todos os campos!" });
      };

      const searchEmail = await User.findOne<Promise<IUserModel>>({ userEmail: email });
      if (searchEmail) {
        return res.status(400).send({ message: "Email em uso!" });
      };

      const hashedPassword = await hashPassword(password);

      const newUser = new User({
        userName,
        userEmail: email,
        userPassword: hashedPassword,
      });

      newUser.save((error: any) => {
        if (error) {
          return res.status(400).send({ message: "Preencha os campos corretamente", error });
        } else {
          return res.status(200).send({ message: "Registrado(a) com sucesso!" });
        }
      });
    } catch (error) {
      throw res.status(500).send({ message: "Internal server error" });
    }
  },
};
