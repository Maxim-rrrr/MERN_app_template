import Router from 'express'

import { check } from "express-validator"

import controller from '../controllers/authController'
import authMiddleware from '../middlewaree/authMiddleware'
import roleMiddleware from '../middlewaree/roleMiddleware'


const router = new Router()

router.post('/registration', [
    check('username', "Имя пользователя не может быть пустым").notEmpty(),
    check('password', "Пароль должен быть больше 4 и меньше 10 символов").isLength({min:4, max:10})
], controller.registration)

router.post('/login', controller.login)

router.get('/users', roleMiddleware(["ADMIN"]), controller.getUsers)

export default router