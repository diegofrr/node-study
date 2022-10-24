import { Router } from "express";
import User from "./app/models/User";

const routes = new Router();

routes.get("/test", async (request, response) => {
    const user = await User.create({
        name: "Diêgo",
        email: "diego@gmail.com",
        password_hash: "333333",
    });
    response.json(user);
});

export default routes;
