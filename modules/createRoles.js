import Role from "../Schemes/Role.js";


const createRoles = (roles) => {
    roles.forEach(async (value) => {
        await Role.findOne({ value }).then(role => {
            if (!role) {
                Role.create({ value })
            }
        })
    })
}

export default createRoles