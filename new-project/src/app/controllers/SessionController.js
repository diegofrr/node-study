import jwt from 'jsonwebtoken';
import User from '../models/User';

import authConfig from '../../config/auth';

class SessionController {
    async store(request, response) {
        const { email, password } = request.body;

        // verifica se existe email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return response.status(401).json({ error: 'Usuário não existe.' });
        }

        // verifica a senha
        if (!(await user.checkPassword(password))) {
            return response.status(401).json({ error: 'Senha incorreta.' });
        }

        const { id, name } = user;
        return response.json({
            user: {
                id,
                name,
                email,
            },
            token: jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        });
    }
}

export default new SessionController();
