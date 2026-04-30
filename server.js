require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');

const app = express();

app.use(express.static('.'));

app.get('/weather', async (req, res) => {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const city = req.query.city || "Oulu";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},FI&units=metric&lang=en&appid=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
});

app.listen(3000, () => console.log("Server running"));