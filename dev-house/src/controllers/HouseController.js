import * as Yup from "yup";

import House from "../models/House";
import User from "../models/User";

import formattedSchemaError from "../utils/formatters";

export default new (class HouseController {
    async index(request, response) {
        const status = request.query?.status || null;
        if (!status) return response.json(await House.find());
        if (!["true", "false"].includes(status))
            return response.json({ error: "Status inválido!" });
        const houses = await House.find({ status });
        return response.json({ amount: houses.length, houses });
    }

    async store(request, response) {
        const schema = Yup.object().shape({
            description: Yup.string().min(10).max(100),
            price: Yup.number().positive().required(),
            location: Yup.string().required(),
            status: Yup.boolean().required(),
        });

        const { filename } = request.file;
        const { description, price, location, status } = request.body;
        const { user_id } = request.headers;

        await schema
            .validate(request.body)
            .then(async () =>
                response.json(
                    await House.create({
                        user: user_id,
                        thumbnail: filename,
                        description,
                        location,
                        price,
                        status,
                    })
                )
            )
            .catch((err) => response.json(formattedSchemaError(err)));
    }

    async update(request, response) {
        const { filename } = request.file;
        const { house_id } = request.params;
        const { description, price, location, status } = request.body;
        const { user_id } = request.headers;

        const user = (await User.findById(user_id)) || null;
        const houses = (await House.findById(house_id)) || null;

        if (!user) return response.json({ error: "Usuário não encontrado!" });
        if (!houses) return response.json({ error: "Casa não encontrada!" });

        if (String(user._id) !== String(houses.user)) {
            return response
                .status(401)
                .json({ error: "Usuário não autorizado!" });
        }

        await House.updateOne(
            { _id: house_id },
            {
                user: user_id,
                thumbnail: filename,
                description,
                price,
                location,
                status,
            }
        );

        return response.json({ message: "Dados atualizados!" });
    }

    async destroy(request, response) {
        const { house_id } = request.body;
        const { user_id } = request.headers;

        try {
            const user = (await User.findById(user_id)) || null;
            const houses = (await House.findById(house_id)) || null;

            if (!user)
                return response.json({ error: "Usuário não encontrado!" });
            if (!houses)
                return response.json({ error: "Casa não encontrada!" });

            if (String(user._id) !== String(houses.user)) {
                return response
                    .status(401)
                    .json({ error: "Usuário não autorizado!" });
            }
        } catch {
            return response.json({ error: "Erro desconhecido :(" });
        }

        await House.findByIdAndDelete({ _id: house_id });

        return response.json({ message: "Casa deletada!" });
    }
})();
