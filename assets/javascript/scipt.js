var searchButton = document.getElementById("search-btn");

// display history
document.addEventListener('DOMContentLoaded', function () {
    const historyList = document.getElementById('history-list');
    const userHistory = JSON.parse(localStorage.getItem('weather-history')) || [];

    userHistory.forEach(query => {
        const listItem = document.createElement('button');
        const link = document.createElement('a');
        link.href = '#';
        // Convert query object properties to an array
        const queryArray = Object.values(query);
        link.textContent = queryArray.join(' ');

        link.addEventListener('click', function () {
            const [value1] = queryArray;
            document.getElementById('search-box').value = value1;
        });

        listItem.appendChild(link);
        historyList.appendChild(listItem);
    });
});

// cause all population to take place on search button click
searchButton.addEventListener('click', function () {
    // prep fetch variables
    const userInput = document.getElementById('search-box').value;
    const geocodingAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${userInput}&limit=1&appid=5fb9baa22b9c4016a10a5d9c4a88d1bd`;

    // handle fetch calls
    fetch(geocodingAPI)
        .then(response => response.json())
        .then(data => {
            // Extract the required values from the geocoding response
            const lat = data[0].lat;
            const lon = data[0].lon;

            // input extracted data into weatherAPI
            const weatherAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=5fb9baa22b9c4016a10a5d9c4a88d1bd`;

            //fetch weather API
            fetch(weatherAPI)
                .then(response => response.json())
                .then(weatherData => {
                    // define city name
                    const cityName = weatherData.city.name;

                    // associate city name with the <div> id="display-weather"
                    const displayWeatherDiv = document.getElementById("display-weather");

                    // prepare section for appending

                    // append city name as an <h2> to the <div> id="display-weather"
                    const cityNameHeading = document.createElement("h2");
                    cityNameHeading.textContent = cityName + ":";

                    existingCityNameHeading = displayWeatherDiv.querySelector("h2");
                    if (existingCityNameHeading) {
                        existingCityNameHeading.remove();
                    }
                    displayWeatherDiv.appendChild(cityNameHeading);


                    console.log(weatherData);

                })
                .catch(error => {
                    console.error(error);
                });
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