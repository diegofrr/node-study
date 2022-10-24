import Sequelize from "sequelize";
import db_config from "../config/db";

import User from "../app/models/User";

const models = [User];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(db_config);
        models.map((model) => model.init(this.connection));
    }
}

export default new Database();
