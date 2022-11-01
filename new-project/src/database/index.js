import Sequelize from 'sequelize';
import db_config from '../config/db';

import User from '../app/models/User';
import Task from '../app/models/Task';

const models = [User, Task];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(db_config);
        models
            .map((model) => model.init(this.connection))
            .map(
                (model) =>
                    model.associations &&
                    model.associations(this.connection.models)
            );
    }
}

export default new Database();
