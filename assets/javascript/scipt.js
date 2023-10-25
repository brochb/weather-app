var searchButton = document.getElementById("search-btn");

function createCurrentWeatherDisplay(data) {
    const displayWeatherDiv = document.getElementById("display-weather");
    const currentWeatherDiv = document.createElement("div");
    currentWeatherDiv.id = "current-weather";
    if (data) {
        const temperatureInFahrenheit = ((data.temperature - 273.15) * 9 / 5) + 32;
        currentWeatherDiv.innerHTML = `
            <h2>Current Weather</h2>
            <img src="${data.icon}" alt="Weather icon">
            <p>Temperature: ${temperatureInFahrenheit.toFixed(2)}°F</p>
            <p>Wind Speed: ${data.windSpeed} m/s</p>
            <p>Humidity: ${data.humidity}%</p>
        `;
    } else {
        currentWeatherDiv.innerHTML = `
            <h2>Current Weather</h2>
            <p>Weather data not available</p>
        `;
    }}

function createForecastCard(date, icon, temperatureInFahrenheit, windSpeed, humidity) {
    const forecastCard = document.createElement("li");
    if (date && icon && temperatureInFahrenheit && windSpeed && humidity) {
        forecastCard.innerHTML = `
            <h3>${date}</h3>
            <img src="${icon}" alt="Weather icon">
            <p>Temperature: ${temperatureInFahrenheit.toFixed(2)}°F</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
            <p>Humidity: ${humidity}%</p>
        `;
    } else {
        forecastCard.innerHTML = `
            <h3>Forecast</h3>
            <p>Weather data not available</p>
        `;
    }
    return forecastCard;
}


searchButton.addEventListener('click', function () {
    const userInput = document.getElementById('search-box').value;
    const geocodingAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${userInput}&limit=1&appid=5fb9baa22b9c4016a10a5d9c4a88d1bd`;

    fetch(geocodingAPI)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const lat = data[0].lat;
                const lon = data[0].lon;
                const weatherAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=5fb9baa22b9c4016a10a5d9c4a88d1bd`;

                fetch(weatherAPI)
                    .then(response => response.json())
                    .then(weatherData => {
                        const cityName = weatherData.city.name;
                        const currentWeatherData = weatherData.list[0] ? {
                            icon: `http://openweathermap.org/img/wn/${weatherData.list[0].weather[0].icon}.png`,
                            temperature: weatherData.list[0].main.temp,
                            windSpeed: weatherData.list[0].wind.speed,
                            humidity: weatherData.list[0].main.humidity
                        } : null;

                        currentWeatherData.temperatureInFahrenheit = ((currentWeatherData.temperature -273.15) * 9 / 5) + 32;

                        createCurrentWeatherDisplay(currentWeatherData);

                        const forecastData = weatherData.list.filter((data, index) => index % 8 === 0).slice(0, 5);
                        const forecastList = document.getElementById("display-forecast-list");

                        forecastList.innerHTML = '';

                        forecastData.forEach(dayData => {
                            const date = dayData.dt_txt;
                            const icon = `http://openweathermap.org/img/wn/${dayData.weather[0].icon}.png`;
                            const temperatureInFahrenheit = ((dayData.main.temp - 273.15) * 9 / 5) + 32;
                            const windSpeed = dayData.wind.speed;
                            const humidity = dayData.main.humidity;

                            const forecastCard = createForecastCard(date, icon, temperatureInFahrenheit, windSpeed, humidity);
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
