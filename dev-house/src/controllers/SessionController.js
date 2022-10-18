// metodos: index, show, update, store, destroy

/*
index => listar sessões
store: criar sessão
show: lista ÚNICA sessão
update: atualizar sessão
destroy: deletar sessão
*/

import User from "../models/User"

export default new class SessionControler {

    async index(request, response) {
        const { email } = request.query;
        if (email) return response.json(await User.find({ email }))
        const users = await User.find();
        return response.json({ amount: users.length, users });
    }

    async store(request, response) {
        const { email } = request.body;

        // verifica se já existe e-mail
        let user = await User.findOne({ email });

        if (!user) {
            // add novo user
            user = await User.create({ email })
        }

        return response.json(user);
    }
}