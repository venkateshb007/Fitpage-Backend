const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();
app.use(express.json());

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

// Apply rate limiting only to specific routes
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

app.get('/weather/:location_id', async (req, res) => {
    const location = getLocationById(req.params.location_id);
    if (!location) {
        res.status(404).json('Location Not Found');
    } else {
        try {
            if (weatherCache[location.id] && isCacheValid(weatherCache[location.id].timeStamp)) {
                res.json(weatherCache[location.id].data);
            } else {
                const weatherData = await fetchWeatherData(location.latitude, location.longitude);

                weatherCache[location.id] = {
                    data: weatherData,
                    timeStamp: Date.now(),
                };
                res.json(weatherData);
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Error Fetching Weather Data');
        }
    }
});

app.get('/history/:location_id', (req, res) => {
    const location = getLocationById(req.params.location_id);
    if (!location) {
        res.status(404).send('Location Not Found');
    } else {
        const historicalData = getHistoricalData(location.id);
        if (!historicalData.length) {
            res.send('No Historical Data Available');
        } else {
            const summary = generateSummary(historicalData);
            res.json({ historicalData, summary });
        }
    }
});

function getLocationById(locationId) {
    return locations.find((loc) => loc.id === parseInt(locationId));
}

function getHistoricalData(locationId) {
    // Assuming historicalData is a global variable or imported from another module
    return historicalData.filter((data) => data.locationId === locationId);
}

function generateSummary(historicalData) {
    if (historicalData.length === 0) {
        return null;
    }
    const totalTemperature = historicalData.reduce((sum, data) => sum + data.temperature, 0);
    const averageTemperature = totalTemperature / historicalData.length;

    const totalHumidity = historicalData.reduce((sum, data) => sum + data.humidity, 0);
    const averageHumidity = totalHumidity / historicalData.length;

    const totalWindSpeed = historicalData.reduce((sum, data) => sum + data.windSpeed, 0);
    const averageWindSpeed = totalWindSpeed / historicalData.length;

    const maxTemperature = Math.max(...historicalData.map((data) => data.temperature));
    const minTemperature = Math.min(...historicalData.map((data) => data.temperature));

    const maxHumidity = Math.max(...historicalData.map((data) => data.humidity));
    const minHumidity = Math.min(...historicalData.map((data) => data.humidity));

    const maxWindSpeed = Math.max(...historicalData.map((data) => data.windSpeed));
    const minWindSpeed = Math.min(...historicalData.map((data) => data.windSpeed));

    return {
        averageTemperature,
        averageHumidity,
        averageWindSpeed,
        maxTemperature,
        minTemperature,
        maxHumidity,
        minHumidity,
        maxWindSpeed,
        minWindSpeed,
    };
}

async function fetchWeatherData(latitude, longitude) {
    const apiKey = process.env.OPEN_WEATHER_MAP_API_KEY;
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: {
                lat: latitude,
                lon: longitude,
                appid: apiKey,
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

function isCacheValid(timeStamp) {
    const cacheDuration = 60 * 60 * 1000;
    return Date.now() - timeStamp <= cacheDuration;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
