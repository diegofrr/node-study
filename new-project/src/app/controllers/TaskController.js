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

    async update(request, response) {
        const { task_id } = request.params;
        const task = await Task.findByPk(task_id);
        if (!task) {
            return response
                .status(400)
                .json({ eror: 'Tarefa não encontrada.' });
        }
        if (task.user_id !== request.userId) {
            return response.status(401).json({ error: 'Não autorizado' });
        }
        await task.update(request.body);
        return response.json(task);
    }

    async delete(request, response) {
        const task = await Task.findByPk(request.params.task_id);
        if (!task) {
            return response.json({ error: 'Tarefa não existe.' });
        }
        if (task.user_id !== request.userId) {
            return response.status(401).json({ error: 'Não autorizado.' });
        }

        await task.destroy();
        return response.send();
    }
})();
