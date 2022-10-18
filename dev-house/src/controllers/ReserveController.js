import Reserve from "../models/Reserve";
import User from "../models/User";
import House from "../models/House";

export default new (class ReserveController {
    async store(request, response) {
        const { user_id } = request.headers;
        const { house_id } = request.params;
        const { date } = request.body;

        const house = await House.findById(house_id);
        if (!house)
            return response.status(400).json({ error: "Esta casa não existe" });
        if (house.status !== true)
            return response
                .status(400)
                .json({ error: "Esta casa não está disponível." });

        const user = await User.findById(user_id);
        if (String(user._id) === String(house.user)) {
            return response
                .status(401)
                .json({ error: "Não é possível reservar sua própria casa." });
        }

        const reserve = await Reserve.create({
            user: user_id,
            house: house_id,
            date,
        });

        await reserve.populate("user house");
        return response.json(reserve);
    }

    async index(request, response) {
        try {
            const { user_id } = request.headers;
            if (!user_id)
                return response.json(await Reserve.find().populate("house"));
            const reserves = await Reserve.find({ user: user_id }).populate(
                "house"
            );
            return response.json(reserves);
        } catch {
            return response.json({ error: "ID do usuário é inválido!" });
        }
    }

    async destroy(request, response) {
        const { reserve_id } = request.body;
        await Reserve.findByIdAndDelete({ _id: reserve_id });

        return response.send();
    }
})();
