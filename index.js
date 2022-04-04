const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

//app's possible methods:
//app.get();
//app.post();
//app.put();
//app.delete();

const days = [
    {id: 1, name: "day1"},
    {id: 2, name: "day2"},
    {id: 3, name: "day3"},
    {id: 4, name: "day4"},
    {id: 5, name: "day5"},
];
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/days', (req, res) => {
    res.send(days);
});

app.get('/api/days/:id', (req, res) => {
    const day = days.find(d => d.id === parseInt(req.params.id));
    if (!day) {
        res.status(404).send("day not found");
    }
    else{
        res.send(day);
    }
});
app.post('/api/days', (req, res) => {
    const {error} = validateDay(req.body); //the same as result.error

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    const day = {
        id: days.length + 1,
        name: req.body.name
    }
    days.push(day);
    res.send(day);
});

app.put('/api/days/:id', (req, res) => {
    //error 404? does requested day exist?
    const day = days.find(d => d.id === parseInt(req.params.id));
    if (!day) {
        res.status(404).send("day not found");
    }
    //error 400? is requested change okay?
    const {error} = validateDay(req.body); //the same as result.error

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    day.name = req.body.name;
    res.send(day);

});

app.delete('api/days/:id', (req, res) => {
    const day = days.find(d => d.id === parseInt(req.params.id));
    if (!day) {
        res.status(404).send("day not found");
    }
    else{
    const index = days.indexOf(day);
    days.splice(index, 1);

    res.send(day);
    }
});

function validateDay(day) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(day, schema);
}

//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening to port ${port}...`));