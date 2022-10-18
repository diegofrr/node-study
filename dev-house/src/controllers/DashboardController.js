import House from "../models/House";
import User from "../models/User";

class DashboardController {

    async show(request, response) {
        const { user_id } = request.headers;
        const houses = await House.find({user: user_id});
        if(houses.length === 0) return response.status(404).send({message: 'O usuário não cadastrou nenhuma casa.'})
        return response.json(houses);
    }

}

export default new DashboardController();