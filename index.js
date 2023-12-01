const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

let locations = [];
let weatherCache = {};

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});

//rate limiting only to specific routes
app.use('/locations', limiter);
app.use('/weather', limiter);
app.use('/history', limiter);

app.get('/locations', (req, res) => {
    res.json(locations);
});

app.post('/locations', (req, res) => {
    const { name, latitude, longitude } = req.body;
    const location = { id: locations.length + 1, name, latitude, longitude };
    locations.push(location);
    res.status(201).json(location);
});

app.get('/locations/:location_id', (req, res) => {
    const location = getLocationById(req.params.location_id);
    if (!location) {
        res.status(404).json('Location Not Found');
    } else {
        res.json(location);
    }
});

app.put('/locations/:location_id', (req, res) => {
    const location = getLocationById(req.params.location_id);
    if (!location) {
        res.status(404).json('Location Not Found');
    } else {
        const { name, latitude, longitude } = req.body;
        location.name = name || location.name;
        location.latitude = latitude || location.latitude;
        location.longitude = longitude || location.longitude;
        res.json(location);
    }
});

app.delete('/locations/:location_id', (req, res) => {
    const index = locations.findIndex((loc) => loc.id === parseInt(req.params.location_id));
    if (index === -1) {
        res.status(404).json('Location Not Found');
    } else {
        locations.splice(index, 1);
        res.send('Location Deleted Successfully');
    }
});

app.get('/weather/:location_name', async (req, res) => {
    const locationName = req.params.location_name;
    try {
        const weatherData = await fetchWeatherDataByName(locationName);

        res.json(weatherData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error Fetching Weather Data');
    }
});

async function fetchWeatherDataByName(locationName) {
    const apiKey = process.env.OPEN_WEATHER_MAP_API_KEY;
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: {
                q: locationName.replace(/\s/g, '+'),
                appid: apiKey, //replace actual api key
                units: 'metric',
            },
        });

        const { main, wind } = response.data;
        return {
            temperature: main.temp,
            humidity: main.humidity,
            windSpeed: wind.speed,
        };
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching weather data from OpenWeatherMap');
    }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
