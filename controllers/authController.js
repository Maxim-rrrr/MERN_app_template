import User from '../Schemes/User.js';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import config from "config";

import service from '../services/authService.js'

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, config.get("secret_key"), {expiresIn: "24h"} )
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Ошибка при регистрации", errors})
            }

            const {username, password} = req.body;

            const candidate = await User.findOne({login: username})
            if (candidate) {
                return res.status(400).json({message: "Пользователь с таким именем уже существует"})
            }

            user = await service.registration(username, password)
            
            return res.json({message: "Пользователь успешно зарегистрирован", user: user})
        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'Registration error'})
        }
    }

    async login(req, res) {
        try {
            const {login, password} = req.body

            const user = await User.findOne({login})
            if (!user) {
                return res.status(400).json({message: `Пользователь ${login} не найден`})
            }

            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: `Введен неверный пароль`})
            }

            const token = generateAccessToken(user._id, user.roles)

            return res.json({token})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
    }
}

export default new authController()
