import User from '../Schemes/User.js';
import Role from '../Schemes/Role.js';
import { USER } from '../roles_list.js';
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