var searchButton = document.getElementById("search-btn");

function createCurrentWeatherDisplay(data) {
    const displayWeatherDiv = document.getElementById("display-weather");
    const currentWeatherDiv = document.createElement("div");
    currentWeatherDiv.id = "current-weather";
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

function createForecastCard(date, icon, temperature, windSpeed, humidity) {
    const forecastCard = document.createElement("li");
    forecastCard.innerHTML = `
        <button>${date}</button>
        <img src="${icon}" alt="Weather icon">
        <p>Temperature: ${temperature}°C</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
        <p>Humidity: ${humidity}%</p>
    `;
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

                        const currentWeatherData = {
                            icon: weatherData.list[0].weather[0].icon,
                            temperature: weatherData.list[0].main.temp,
                            windSpeed: weatherData.list[0].wind.speed,
                            humidity: weatherData.list[0].main.humidity
                        };
                        createCurrentWeatherDisplay(currentWeatherData);

                        const forecastData = weatherData.list.slice(1, 6);
                        const forecastList = document.getElementById("display-forecast-list");

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
