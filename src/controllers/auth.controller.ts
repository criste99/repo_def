import { Request, Response} from "express";
import User, {IUser} from "../models/User";

import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response) => {
    // Guardando un nuevo usuario
    const user: IUser = new User ({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });
    user.password = await user.encryptPassword(user.password);
   const savedUser = await user.save();
    // token
   const token: string = jwt.sign({_id: savedUser._id }, process.env.TOKEN_SECRET || 'tokentest');



    res.header('auth-token', token).json(savedUser);
};

export const signin = async (req: Request, res: Response) => {
  const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).json('email o contraseña incorrecta');

    const correctPassword: boolean = await user.validatePassword(req.body.password);
    if (!correctPassword) return res.status(400).json('contraseña invalida');

    const token: string = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET || 'tokentest', {
        expiresIn: 60 * 60 * 24
    })

   res.header('auth-token', token).json(user);
};

export const profile = async (req: Request, res: Response) => {
    const user = await User.findById(req.userId, {password: 0})
    if(!user) return res.status(404).json('Usuario no encontrado');
        res.json(user);
};