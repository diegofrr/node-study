import Reserve from "../models/Reserve";
import User from "../models/User";
import House from "../models/House";

class ReserveController {

    async store(request, response) {
        const { user_id } = request.headers;
        const { house_id } = request.params;
        const { date } = request.body;

        const house = await House.findById(house_id);
        if (!house) return response.status(400).json({ error: 'Esta casa não existe' });
        if (house.status !== true) return response.status(400).json({ error: 'Esta casa não está disponível.' })

        const user = await User.findById(user_id);
        if (String(user._id) === String(house.user)) {
            return response.status(401).json({ error: 'Não é possível reservar sua própria casa.' })
        }

        console.log(user._id, house.user)

        const reserve = await Reserve.create({
            user: user_id,
            house: house_id,
            date,
        });

        await reserve.populate('user house');
        return response.json(reserve)

    }

    async index(request, response) {
        try {
            const { user_id } = request.headers;
            return response.json(await Reserve.find({ user: user_id }));
        } catch {
            return response.json({ error: 'ID do usuário é inválido!' });
        }
    }
}

export default new ReserveController();