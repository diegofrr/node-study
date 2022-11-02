import * as Yup from 'yup';
import User from '../models/User';

import formattedSchemaError from '../utils/formatters';

export default new (class SessionControler {
    async index(request, response) {
        const { email } = request.query;
        if (email) return response.json(await User.find({ email }));
        const users = await User.find();
        return response.json({ amount: users.length, users });
    }

    async store(request, response) {
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
        });

        schema
            .validate(request.body)
            .then(async () => {
                const { email } = request.body;
                let user = await User.findOne({ email });
                if (!user) {
                    user = await User.create({ email });
                }
                return response.json(user);
            })
            .catch((err) => response.json(formattedSchemaError(err)));
    }
})();
