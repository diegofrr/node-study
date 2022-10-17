export default new class HouseController {

    async store(request, response) {
        console.log(request.body);
        console.log(request.file);
        return response.json({ok: true});
    }

}