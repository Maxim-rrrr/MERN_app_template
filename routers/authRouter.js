import Router from 'express'

import { check } from "express-validator"

import controller from '../controllers/authController.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import roleMiddleware from '../middlewares/roleMiddleware.js'


const router = new Router()

router.post('/registration', [
    check('username', "Имя пользователя не может быть пустым").notEmpty(),
    check('password', "Пароль должен быть больше 6 символов").isLength({min:6})
], controller.registration)

router.post('/login', controller.login)

router.post('/is-admin', roleMiddleware(["ADMIN"]), async (req, res) => { res.send(true) })

router.post('/is-auth', roleMiddleware(["USER"]), async (req, res) => { res.send(true) })

export default router