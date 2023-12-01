# Weather Forecast API

## Introduction

This project is a RESTful API providing real-time weather forecasts based on geographical locations. It allows users to manage locations, retrieve weather forecasts, and access historical weather data.

## Requirements

### Location Management

- Users can add, retrieve, update, and delete locations.
- Each location should have a name, latitude, and longitude.

### Weather Forecast

- Users can request weather forecasts for a specific location.
- The API fetches real-time weather data from an external service (e.g., OpenWeatherMap, WeatherAPI).
- Provides forecasts for parameters like temperature, humidity, wind speed, etc.

### Endpoints

#### Locations

- `/locations` (GET, POST): Get all locations or add a new location
- `/locations/<location_id>` (GET, PUT, DELETE): Get, update, or delete a specific location by ID

#### Weather

- `/weather/<location_id>` (GET): Get the weather forecast for a specific location

#### History

- `/history/<location_id>` (GET): Get historical data and show the summary for the last 7 days, 15 days, and 30 days

### Technical Guidelines

- Integrate with an external weather service API for real-time weather data.
- Implement caching mechanisms to reduce external API calls.
- Ensure proper error handling for unavailable external services.
- Use validation for location data and handle edge cases gracefully.

### Additional Considerations

- Implement rate limiting to prevent API abuse.
- Implement logging for API requests, especially those interacting with the external service.
- Use environment variables for sensitive information like API keys.

## Getting Started

1. Install dependencies:npm install
2. Create a .env file with the following content: OPEN_WEATHER_MAP_API_KEY=your-api-key
PORT=3000
eplace your-api-key with your actual OpenWeatherMap API key.
3. Run the application: node index.js

