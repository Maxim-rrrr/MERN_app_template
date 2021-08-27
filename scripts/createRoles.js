import config from "config";
import mongoose from "mongoose";
import Role from "../Schemes/Role.js";
import { ALL_ROLES } from "../roles_list.js"
import logger from "../modules/logger.js";

const createRoles = () => {
    ALL_ROLES.forEach(async (value, index) => {
        await Role.findOne({ value }).then(async (role) => {
            if (!role) {
                await Role.create({ value }).then(() => {
                    logger.info(`Создана роль: ${value}`)
                })
            } else {
                logger.info(`Уже создана роль: ${value} уже создана`)
            }

            if (index + 1 === ALL_ROLES.length) {
                mongoose.disconnect()
            }
        })
    })
}

const main = async () => {
    await mongoose.connect(config.get("mongoUrl"), {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    });

    createRoles()
}

main()

