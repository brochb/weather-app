// Function on page load, pull the localStorage, and append it to the history
document.addEventListener('DOMContentLoaded', function () {
    const historyList = document.getElementById('history-list');
    const queryHistory = JSON.parse(localStorage.getItem('queryHistory')) || [];

    queryHistory.forEach(query => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        // Convert query object properties to an array
        const queryArray = Object.values(query);
        link.textContent = queryArray.join(' ');

        link.addEventListener('click', function () {
            const [value1, value2, value3, value4] = queryArray;
            document.getElementById('query-input').value = value1;
            document.getElementById('queryCategory').value = value2;
            document.getElementById('min-lexile').value = value3;
            document.getElementById('max-lexile').value = value4;
        });

        listItem.appendChild(link);
        historyList.appendChild(listItem);

    });

    // Call the function to display selected books from sessionStorage on page load
    displaySelectedBooksFromLocalStorage();
});
// event listener on id="search-box"
    // funtion() {
    //  take input value from id="search-box" and run it through the weather API
        //function.displayWeather()
    //}