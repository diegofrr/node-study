import * as Yup from 'yup';
import User from '../models/User';
import formattedSchemaError from '../../utils/formattedSchemaError';

class UserController {
    async store(request, response) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
        });

        schema
            .validate(request.body)
            .then(async () => {
                const { id, name, email } = await User.create(request.body);

                const userExists = await User.findOne({ where: { email } });

                if (userExists) {
                    return response
                        .status(404)
                        .json({ error: 'E-mail já cadastrado!' });
                }

                return response.json({ id, name, email });
            })
            .catch((err) => response.json(formattedSchemaError(err)));
    }

    async update(request, response) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string().min(6),
            password: Yup.string()
                .min(6)
                .when('oldPassword', (oldPassword, field) =>
                    oldPassword ? field.required() : field
                ),
            confirmPassword: Yup.string().when('password', (password, field) =>
                password ? field.required().oneOf([Yup.ref('password')]) : field
            ),
        });

        schema
            .validate(request.body)
            .then(async () => {
                const { email, oldPassword, password } = request.body;

                const user = await User.findByPk(request.userId);

                if (email !== user.email) {
                    const userExists = await User.findOne({
                        where: { email },
                    });

                    if (userExists) {
                        return response
                            .status(404)
                            .json({ error: 'E-mail já cadastrado!' });
                    }
                }

                if (oldPassword === password) {
                    return response.json({ error: 'Sem auterações.' });
                }

                if (oldPassword && !(await user.checkPassword(oldPassword))) {
                    return response
                        .status(401)
                        .json({ error: 'Senha incorreta.' });
                }

                const { id, name } = await user.update(request.body);

                return response.json({ id, name, email });
            })
            .catch((err) => response.json(formattedSchemaError(err)));
    }
}

export default new UserController();
