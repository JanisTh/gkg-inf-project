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
    if (!req.body.name || req.body.name.length < 3) {
        res.status(400).send("name is mandatory and should be min. 3 characters long.");
        return;
    }
    const day = {
        id: days.length + 1,
        name: req.body.name
    }
    days.push(day);
    res.send(day);
});

//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening to port ${port}...`));