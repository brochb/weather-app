var searchButton = document.getElementById("search-btn");

// display history
// Function to create the current weather display
function createCurrentWeatherDisplay(data) {
    const displayWeatherDiv = document.getElementById("display-weather");
    // Create an element to display the current weather
    const currentWeatherDiv = document.createElement("div");
    currentWeatherDiv.id = "current-weather";

    // Populate the current weather display (modify as needed)
    currentWeatherDiv.innerHTML = `
        <h2>Current Weather</h2>
        <img src="${data.icon}" alt="Weather icon">
        <p>Temperature: ${data.temperature}°C</p>
        <p>Wind Speed: ${data.windSpeed} m/s</p>
        <p>Humidity: ${data.humidity}%</p>
    `;

    // Remove the previous current weather display (if any)
    const existingCurrentWeatherDiv = displayWeatherDiv.querySelector("#current-weather");
    if (existingCurrentWeatherDiv) {
        existingCurrentWeatherDiv.remove();
    }

    displayWeatherDiv.appendChild(currentWeatherDiv);
}

// Function to create a forecast card
function createForecastCard(date, icon, temperature, windSpeed, humidity) {
    const forecastCard = document.createElement("li"); // Create an <li> element
    // Populate the forecast card (modify as needed)
    forecastCard.innerHTML = `
        <button>${date}</button>
        <img src="${icon}" alt="Weather icon">
        <p>Temperature: ${temperature}°C</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
        <p>Humidity: ${humidity}%</p>
    `;
    return forecastCard;
}

// Event handler for the search button
searchButton.addEventListener('click', function () {
    // prep fetch variables
    const userInput = document.getElementById('search-box').value;
    const geocodingAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${userInput}&limit=1&appid=5fb9baa22b9c4016a10a5d9c4a88d1bd`;

    // handle fetch calls
    fetch(geocodingAPI)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                // Extract the required values from the geocoding response
                const lat = data[0].lat;
                const lon = data[0].lon;

                // input extracted data into weatherAPI
                const weatherAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=5fb9baa22b9c4016a10a5d9c4a88d1bd`;

                //fetch weather API
                fetch(weatherAPI)
                    .then(response => response.json())
                    .then(weatherData => {
                        // Define city name
                        const cityName = weatherData.city.name;

                        // Create and populate the current weather display
                        const currentWeatherData = {
                            icon: weatherData.list[0].weather[0].icon,
                            temperature: weatherData.list[0].main.temp,
                            windSpeed: weatherData.list[0].wind.speed,
                            humidity: weatherData.list[0].main.humidity
                        };
                        createCurrentWeatherDisplay(currentWeatherData);

                        // Create and populate forecast cards for the next 5 days
                        const forecastData = weatherData.list.slice(1, 6); // Skip the first item (current weather)
                        const forecastList = document.getElementById("display-forecast-list");

                        // Clear existing forecast cards
                        forecastList.innerHTML = '';

                        forecastData.forEach(dayData => {
                            const date = dayData.dt_txt;
                            const icon = dayData.weather[0].icon;
                            const temperature = dayData.main.temp;
                            const windSpeed = dayData.wind.speed;
                            const humidity = dayData.main.humidity;

                            const forecastCard = createForecastCard(date, icon, temperature, windSpeed, humidity);
                            forecastList.appendChild(forecastCard);
                        });

                        console.log(weatherData);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            } else {
                console.error("City not Found");
            }
        })
        .catch(error => {
            console.error(error);
        });

    // handle local storage
    let userHistory = JSON.parse(localStorage.getItem('weather-history')) || [];
    const capitalizedInput = userInput.replace(/\b\w/g, char => char.toUpperCase());
    userHistory.push(capitalizedInput);
    if (userHistory.length > 5) userHistory.splice(0, userHistory.length - 5);
    localStorage.setItem('weather-history', JSON.stringify(userHistory));
});
