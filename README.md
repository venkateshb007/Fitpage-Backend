# FITPAGE-Assignment
#Weather API
A simple RESTful API for retrieving real-time weather forecasts and historical data based on geographical locations.

Overview
This project provides an API that allows users to manage location and retrieve weather information for those locations. It integrates with an external weather service
API(e.g openWeatherMap) to fetch real-time weather data.

Features
 Location Management :
   Add, retrieve, update and delete locations.
   Each locations has a name, latitude and longitude.
 Weather Forecast :
   Get real-time weather forecasts for specific locations.
   Parameters include temperature, humidity, wind speed, etc.
 Endpoints :
   /locations (GET, POST): Get all locations or add a new location.
   /locations/<location_id> (GET, PUT, DELETE): Get, update, or delete a specific location by ID.
   /weather/<location_id> (GET): Get the weather forecast for a specific location.
   /history/<location_id> (GET): Get historical data and a summary.

 Getting Started :
  1.Install Dependencies :
       npm install.
  2.Set Environment Variables :
       Create a .env file with your OpenWeatherMap API key :
          OPEN_WEATHER_MAP_API_KEY=your_api_key_here
  3.Run the Server :
       node index.js
  4.API Endpoints :
       Access the API at http://localhost:3000.

 Testing :
   Use tools like Postman to make requests to various endpoints and ensure correct functionality.
