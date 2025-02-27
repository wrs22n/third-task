const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(express.json());
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(
    morgan(function (tokens, req, res) {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'),
            '-',
            tokens['response-time'](req, res),
            'ms',
            tokens.body(req, res),
        ].join(' ');
    })
);

const cors = require('cors');

app.use(cors());

let persons = [
    {
        id: '1',
        name: 'Arto Hellas',
        number: '040-123456',
    },
    {
        id: '2',
        name: 'Ada Lovelace',
        number: '39-44-5323523',
    },
    {
        id: '3',
        name: 'Dan Abramov',
        number: '12-43-234345',
    },
    {
        id: '4',
        name: 'Mary Poppendieck',
        number: '39-23-6423122',
    },
];

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/info', (req, res) => {
    res.send(`<p>Phone book has info for ${persons.length} people<p/>
            <p>${Date()}<p/>
        `);
});

app.get('/api/persons/:id', (req, res) => {
    const person = persons.find((person) => person.id === req.params.id);

    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
});

app.delete('/api/persons/:id', (req, res) => {
    persons = persons.filter((persons) => persons.id !== req.params.id);

    res.status(204).end();
});

const generateId = (n) => {
    return String(Math.floor(Math.random() * n) + 1);
};

app.post('/api/persons', (req, res) => {
    if (!req.body.name || !req.body.number) {
        return res.status(400).json({
            error: 'need name and number',
        });
    }

    if (persons.find((person) => person.name === req.body.name)) {
        return res.status(409).json({
            error: 'name must be unique',
        });
    }

    const person = {
        name: req.body.name,
        number: req.body.number,
        id: generateId(1000),
    };

    persons = persons.concat(person);

    res.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running`);
});
