const express = require('express');

const server = express();
server.use(express.json());

let students = [
    { name: 'João', code: '111' },
    { name: 'Maria', code: '222' },
    { name: 'José', code: '333' }
]

// Middleware global
server.use((req, res, next) => {
    console.log('url chamada ' + req.url)
    return next();
})

function checkStudents(req, res, next) {
    if(!req.body.student) {
        return res.status(400).json({error: 'Estudante é obrigatório'})
    } if (['', null].includes(req.body.student.name.replace(/ /g,''))) {
        return res.status(400).json({error: 'Nome do estudante é obrigatório'})
    } if (req.body.student.name.length < 5) {
        return res.status(400).json({error: 'O nome do estudante precisa ter, pelo menos, 5 caracteres.'})
    }
    return next(); 
}

const checkStudent = (req, res, next) => {
    const student = students.filter(e => e.code === req.params.id);
    if(student.length === 0) {
        return res.status(404).json({error: 'Estudante não encontrado'})
    }  
    
    req.student = student;

    return next();
}

server.get('/students', (req, res) => {
    return res.json(students);

});

server.get('/students/:id', checkStudent, (req, res) => {
    return res.json(req.student)
});

server.post('/students', checkStudents, (req, res) => {
    const { student } = req.body;
    
    if(student.name === "" || student.code === "") {
        return res.json({message: 'Parâmetros inválidos'})
    }

    const newStudent = {name: student.name, code: String(student.code)}

    if(newStudent.code.length !== 3) {
        return res.json({message: 'O código precisa ter 3 caracteres'})
    }

    if(students.some(e => e.code === newStudent.code)) {
        return res.json({message: 'Já existe um estudante com este código'})
    } else {
        students.push(newStudent);
        return res.json(students);
    }
});

server.put('/students/:id', checkStudents, (req, res) => {
    const { id } = req.params;
    const { student } = req.body;

    students[id] = student;
    
    return res.json(students);
})

server.delete('/students/:code', (req, res) => {
    const { code } = req.params;
    const listSize = students.length;
    students = students.filter(e => e.code !== code);

    return res.json(
        students.length === listSize 
        ? {message: `O código ${code} não corresponde a nenhum estudante.`}
        : students
    );
})

server.listen(3333);