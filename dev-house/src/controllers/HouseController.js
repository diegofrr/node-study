import House from '../models/House';

export default new class HouseController {

    async store(request, response) {
        const { filename } = request.file;
        const { description, price, location, status } = request.body;
        const { user_id } = request.headers;
        
        const house = await House.create({
            user: user_id,
            thumbnail: filename,
            description,
            location,
            price,
            status,
        })

        return response.json(house);
    }

}