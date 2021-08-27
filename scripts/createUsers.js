import User from '../Schemes/User.js';
import Role from '../Schemes/Role.js';
import bcrypt from 'bcryptjs';
import config from "config";
import mongoose from "mongoose";
import logger from "../modules/logger.js";

const createUsers = async () => {
    const users = config.get('start_users')

    users.forEach(async (user, index) => {
        const hashPassword = bcrypt.hashSync(user.pass, 7);

        const candidat = await User.findOne({login: user.login})
        if (candidat) {
            logger.error(`Пользователь с логином ${user.login} уже существует: ${JSON.stringify(candidat)}`)
        } else {
            const userDB = new User({login: user.login, password: hashPassword, roles: user.roles})
            await userDB.save()
            logger.info(`Создан пользователь: ${JSON.stringify(user)}`)
        }

        if (index + 1 === users.length) {
            mongoose.disconnect()
        }
    });
}


const main = async () => {
    await mongoose.connect(config.get("mongoUrl"), {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    });

    await createUsers()
}

main()

