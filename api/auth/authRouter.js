import Router from 'express'

import { check } from "express-validator"

import controller from './authController.js'
import authMiddleware from '../../middlewares/authMiddleware.js'
import roleMiddleware from '../../middlewares/roleMiddleware.js'


const router = new Router()

/**
 * @swagger
 * /auth/registration:
 *  post:
 *    description: Регистрация новых пользователей
 *  parameters:
 *    - name: username
 *      in: data
 *      description: Уникальное имя пользователя, логин, не может быть пустой строкой
 *      required: true
 *      schema:
 *        type: string
 *        format: string
 *    - name: password
 *      in: data
 *      description: Пароль пользователь, должен быть длиннее 6 символов
 *      required: true
 *      schema:
 *        type: string
 *        format: string
 *  responses:
 *    '200':
 *      description: OK
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message: 
 *                type: string
 *    '400':
 *      description: Вернётся при нарушении валидации или при ситуации, что пользователь с таким именем уже есть { message }
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message: 
 *                type: string
 *    '500':
 *      description: Registration error { message }
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message: 
 *                type: string
 *  
 */
router.post('/registration', [
    check('username', "Имя пользователя не может быть пустым").notEmpty(),
    check('password', "Пароль должен быть больше 6 символов").isLength({min:6})
], controller.registration)

/**
 * @swagger
 * /auth/login:
 *  post:
 *    description: Авторизация пользователя
 *  parameters:
 *    - name: login
 *      in: data
 *      description: Логин пользователя
 *      required: true
 *      schema:
 *        type: string
 *        format: string
 *    - name: password
 *      in: data
 *      description: Пароль пользователь
 *      required: true
 *      schema:
 *        type: string
 *        format: string
 *  responses:
 *    '200':
 *      description: Вернётся токен авторизации пользователя { token }
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              token: 
 *                type: string
 *    '400':
 *      description: Вернётся при отсутствии пользователя с таким логином или при неверном пароле
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message: 
 *                type: string
 *    '500':
 *      description: Login error { message }
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message: 
 *                type: string
 *  
 */
router.post('/login', controller.login)

/**
 * @swagger
 * /auth/is-admin:
 *  post:
 *    description: Проверка пользователя на наличие роли ADMIN
 *  parameters:
 *    - name: authorization
 *      in: header
 *      description: Токен авторизации пользователя
 *      required: true
 *      schema:
 *        type: string
 *        format: string
 *  responses:
 *    '200':
 *      description: OK
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              token: 
 *                type: string
 *    '400':
 *      description: Пользователь не авторизован или не имеет роли ADMIN
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message: 
 *                type: string
 *  
 */
router.post('/is-admin', roleMiddleware(["ADMIN"]), async (req, res) => { res.send(true) })

/**
 * @swagger
 * /auth/is-user:
 *  post:
 *    description: Проверка пользователя на наличие роли USER
 *  parameters:
 *    - name: authorization
 *      in: header
 *      description: Токен авторизации пользователя
 *      required: true
 *      schema:
 *        type: string
 *        format: string
 *  responses:
 *    '200':
 *      description: OK
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              token: 
 *                type: string
 *    '400':
 *      description: Пользователь не авторизован или не имеет роли USER
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message: 
 *                type: string
 *  
 */
router.post('/is-auth', roleMiddleware(["USER"]), async (req, res) => { res.send(true) })

export default router