import Sequelize, { Model } from 'sequelize';

class Task extends Model {
    static init(sequelize) {
        super.init(
            {
                task: Sequelize.STRING,
                check: Sequelize.BOOLEAN,
            },
            {
                sequelize,
            }
        );
        return this;
    }

    static associations(models) {
        this.belongsTo(models.user, { foreignKey: 'user_id', as: 'user' });
    }
}

export default Task;
