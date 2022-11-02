import * as Yup from 'yup';
import Task from '../models/Task';
import formattedSchemaError from '../../utils/formattedSchemaError';

export default new (class TaskController {
    async index(request, response) {
        const tasks = await Task.findAll({
            where: { user_id: request.userId, check: false },
        });
        return response.json({ amount: tasks.length, tasks });
    }

    async store(request, response) {
        const schema = Yup.object().shape({
            task: Yup.string().required(),
        });

        schema
            .validate(request.body)
            .then(async () => {
                const { task } = request.body;
                const tasks = await Task.create({
                    user_id: request.userId,
                    task,
                });

                return response.json(tasks);
            })
            .catch((err) =>
                response.status(400).json(formattedSchemaError(err))
            );
    }
})();
