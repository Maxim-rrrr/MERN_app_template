# MERN_app_template

# Содержание
1. [Конфигурация](#Конфигурация)
    1. [Поля конфига](#Поля_конфига)
2. [Запуск приложения](#Запуск_приложения)
3. [База данных](#База_данных)
    1. [Подключение БД](#Подключение_БД)
    2. [Создание схем](#Создание_схем)
4. [API](#API)
5. [Система логирования](#Система_логирования)
6. [Middlewares](#Middlewares)
7. [Хранение пользовательских файлов](#Хранение_пользовательских_файлов)
8. [Swagger](#Swagger)
9. [Отправка сообщений Email](#Отправка_сообщений_Email)
10. [Система авторизации](#Система_авторизации)
    1. [Роли](#Роли)
    2. [Создание пользователей](#Создание_пользователей)


# Конфигурация <a name="Конфигурация"></a>
Сделайте копию папки *./config.example*  и переменуйте в *config* 

*default.json* - конфиг для разработки
*production.json* - конфиг для продакшена 

## Поля конфига <a name="Поля_конфига"></a>
*port* - Порт запуска приложения  
*url_main_page* - Url главной страницы  
*mongoUrl* - Ссылка подключения к MongoDB [База данных](#База_данных)  
*nameInEmail* - Название организации указанное а поле "от кого" при отправке сообщения [Отправка сообщений Email](#Отправка_сообщений_Email)   
*emailSendMessage* - Логин аккаунта для отправки сообщения [Отправка сообщений Email](#Отправка_сообщений_Email)  
*passSendMessage* - Пароль аккаунта для отправки сообщения [Отправка сообщений Email](#Отправка_сообщений_Email)  
*secret_key* - Секретный ключ приложения, сгенерировать любой, симвалов 30 хватит   
*start_users* - Создание пользователей через конфиг [Создание пользователей](#Создание_пользователей)  
*logger_console* - Boolean, писать логи в консоль [Система логирования](#Система_логирования)  
*logger_file* - Boolean, писать логи в файл [Система логирования](#Система_логирования)  
*logger_mongoDB* - Boolean, писать логи в Базу данных [Система логирования](#Система_логирования)  

# Запуск приложения <a name="Запуск_приложения"></a>
Установка зависимостей для сервера
```
npm install
```
Установка зависимостей клиентской части
```
npm run client:install
```
# База данных <a name="База_данных"></a>
База данных MongoDB  

## Подключение БД <a name="Подключение_БД"></a>
Для подключения БД нужно указать ссылка на подключение в поле *mongoUrl* в файле конфигурации [Поля конфига](#Поля_конфига)

## Создание схем <a name="Создание_схем"></a>
Создание схем документов БД в папке *Schemes*  
[Статья по созданию моделей](https://metanit.com/web/nodejs/6.7.php)  
Пример:
```
import pkg from 'mongoose';
const {Schema, model} = pkg;


const User = new Schema({
    login: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    roles: [{type: String, ref: 'Role'}]
})

export default model('User', User)
```
# API <a name="API"></a>
Для создания API points есть папка *./api*

Создаём папку с названием роута, а в нём три файла: *Controller*, *Router*, *Service*  

Пример:
```
api
└───auth
│   │   authController.js
│   │   authRouter.js
│   │   authService.js
```

В Router определяем роуты данной ветки API  
Пример: 
```
import Router from 'express'
import { check } from "express-validator"
import controller from './authController.js'

const router = new Router()

router.post('/registration', [
    check('username', "Имя пользователя не может быть пустым").notEmpty(),
    check('password', "Пароль должен быть больше 6 символов").isLength({min:6})
], controller.registration)

router.post('/login', controller.login)

export default router
```
И подключаем Router к приложению в файле ./index.js  
Пример:
```
import authRouter from './api/auth/authRouter.js'

app.use("/auth", authRouter) // Втавлять после app.use(express.json())
```


И подключаем к роутам методы контроллера  
Пример контроллера: 
```
import User from '../../Schemes/User.js';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import config from "config";

import service from './authService.js'

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
                console.log(errors)
                return res.status(400).json({message: 'Логин не должен быть пустым, а пароль должен быть длинее 6 символов', errors})
            }

            const {username, password} = req.body;

            const candidate = await User.findOne({login: username})
            if (candidate) {
                return res.status(400).json({message: "Пользователь с таким именем уже существует"})
            }

            let user = await service.registration(username, password)

            const token = generateAccessToken(user._id, user.roles)
            
            return res.json({status: 200, message: "Пользователь успешно зарегистрирован", token})
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
            res.status(500).json({message: 'Login error'})
        }
    }
}

export default new authController()

```

*Service* - Нужен для выноса вычисляемой логики из контроллеров или общих функций для нескольких API points в этой ветке

Пример Service:
```
import User from '../../Schemes/User.js';
import Role from '../../Schemes/Role.js';
import { USER } from '../../roles_list.js';
import bcrypt from 'bcryptjs';

class authService {
    async registration(username, password) {
        const hashPassword = bcrypt.hashSync(password, 7);

        const userRole = await Role.findOne({value: USER})
        const user = new User({login: username, password: hashPassword, roles: [userRole.value]})
        
        await user.save()

        return user
    }
}

export default new authService()
```


# Система логирования <a name="Система_логирования"></a>
Система логирования *winston*  
[Статья поможет если, что переписать систему логирования](https://www.8host.com/blog/logirovanie-prilozheniya-node-js-s-pomoshhyu-winston/)
## Настройка логера 
В файле конфигурации заполняем полья *logger_console*, *logger_file*, *logger_mongoDB* для определения места записи логов [Поля конфига](#Поля_конфига)

## Использование логера 
Импортируем объект логера из файла *./modules/logger.js*

```
import logger from "./modules/logger.js";
```

>Уровни логирования определяют приоритет сообщения и обозначаются целым числом. Winston использует уровни логирования npm, где 0 имеет наивысший приоритет.
> 0: error (ошибка)  
> 1: warn (предупреждение)  
> 2: info (информация)  
> 3: verbose (расширенный вывод)  
> 4: debug (отладочное сообщение)  
> 5: silly (простое сообщение)  

Создание лога:
```
logger.info('INFO') // Информационный лог
logger.error('ERROR') // Лог об ошибки
...
```
# Middlewares <a name="Middlewares"></a>
Middlewares лежат в папке *./middlewares*  
Изначально есть уже готовые middlewares:    

*authMiddleware.js* - Проверка на авторизованность пользователя, проверяет *req.headers.authorization* на наличие jwt токена и его валиднось, записывае в поле *req.user* информацию о пользователе из токена
Пример:
```
router.post('/is-auth', authMiddleware(), async (req, res) => { res.send(true) })
```  

*roleMiddleware.js* - Проверка авторизация и роли пользователя, проверяет *req.headers.authorization* на наличие jwt токена и зашифрованных там ролей  
Привет:
```
router.post('/is-admin', roleMiddleware(["ADMIN"]), async (req, res) => { res.send(true) })
```

*fileStorage.js* - Сохранение файлов присылаемых с клиенской части с помощью *multer* [Хранение пользовательских файлов](#Хранение_пользовательских_файлов)

# Хранение пользовательских файлов <a name="Хранение_пользовательских_файлов"></a>

Для начала нужно создать в корневой папке проекта папку *uploads*

Сохнанение пользовательских файлов прилетающих в запросах сохраняем через библиотеку [Multer](https://github.com/expressjs/multer/blob/master/doc/README-ru.md)  
На основе библиотеке написан middleware *fileStorage.js*

Все файлы будут сохраняться в папке *./uploads*, отправлять надо запрос **без** заголовка  *headers['Content-Type'] = 'application/json'* и в формате **formData**

Пример:
```
import express from "express";
import upload from './modules/fileStorage.js'

const app = express()

app.post('/profile', upload.single('avatar'), function (req, res, next) {
  // req.file - файл `avatar`
  // req.body сохранит текстовые поля, если они будут
})

app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
  // req.files - массив файлов `photos`
  // req.body сохранит текстовые поля, если они будут
})

const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
app.post('/cool-profile', cpUpload, function (req, res, next) {
  // req.files - объект (String -> Array), где fieldname - ключ, и значение - массив файлов
  //
  // например:
  //  req.files['avatar'][0] -> File
  //  req.files['gallery'] -> Array
  //
  // req.body сохранит текстовые поля, если они будут
})
```

# Swagger <a name="Swagger"></a>
Swagger запускается по ссылке http://localhost:4000/api-docs  
Конфиг Swagger *./swaggerOptions.js*  

Заполняем комментарии в файле роутера и добавляем этот файл в роутерам api в файле *./swaggerOptions.js* 

Пример комментария:
```
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
```


# Отправка сообщений Email <a name="Отправка_сообщений_Email"></a>
Заполняем поля *nameInEmail*, *emailSendMessage*, *passSendMessage* в файле конфигурации [Поля конфига](#Поля_конфига)  

Создать почту лучше mail.ru, иначе может не заработать  

Для отправки сообщения есть функция в в файле *./modules/mail.js*  
На вход функция принимает 
```
/**
 * Функция отправки сообщений на почту
 *
 * @param {string} to Email получателя
 * @param {string} subject Заголовок
 * @param {string} text Текст письма
 * @param {string} html Что-то форматированное через HTML
 * @param {Array} attachments  Список файлов прикреплённых к письму
 * 
 * @returns { Promise<boolean> }
 */
 ```
# Система авторизации <a name="Система_авторизации"></a>
## Роли <a name="Роли"></a>

Изначально надо создать роли пользователей в файле **./role_list.js**  

Пример:
```
export const USER = "USER";
export const ADMIN = "ADMIN";

export const ALL_ROLES = [
    USER,
    ADMIN
];
```
И запустить скрипт 
```
npm run create:roles
```
или
```
npm run create:roles:dev
```
с использование файла конфигурации для продакшена
```
npm run create:roles:prod
```

## Создание пользователей <a name="Создание_пользователей"></a>

Для создания пользователей можно использовать поле *start_users* в файле конфигурации  

Пример:
```
"start_users": [
    {
      "login": "admin",
      "pass": "123123",
      "roles": ["ADMIN"]
    }
]
```
И запустить скрипт 
```
npm run create:users
```
или
```
npm run create:users:dev
```
с использование файла конфигурации для продакшена
```
npm run create:users:prod
```
