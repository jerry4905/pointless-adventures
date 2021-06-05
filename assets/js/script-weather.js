function initPage() {
    const cityEl = document.getElementById("enter-city");
    const searchEl = document.getElementById("weather-search");
    const clearEl = document.getElementById("clear-history");
    const nameEl = document.getElementById("city-name");
    const historyEl = document.getElementById("history");
    var todayweatherEl = document.getElementById("today-weather");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

    // Assigning a unique API to a variable
    const APIKey = "&appid=8f62257571888eedbb0ada9d2502e1fa";

    function getPlaces() {
        var searchCity = $("#enter-city").val();
    
        //fetch api 
        fetch(
            "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" + searchCity + "&inputtype=textquery&fields=photos,formatted_address,name,opening_hours,rating&locationbias=circle:2000@47.6918452,-122.2226413&key=AIzaSyCNtC_hpAU4T7PeRgzm9u63MVTF5KGFZdo"
        )
            .then(function (response) {
                return response.json();
            })
            .then(function (response) {
                console.log("api response places", response);
            })
        };

    function getWeather() {
        var searchCity = $("#enter-city").val();
        getPlaces();

        //fetch api 
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" +
            searchCity + APIKey
        )
            .then(function (response) {
                return response.json();
            })
            .then(function (response) {
                console.log("api response", response);

                let tempK = parseFloat(response.main.temp);
                // convert Kelvin to Farenheit
                let tempF = ((tempK - 273.15) * 9 / 5) + 32;
                let humidity = response.main.humidity;
                let windspeed = response.wind.speed;

                // The latitude and longitude are pulled from the first endpoint so they can be used as search parameters in the second enpoint (which gets the UV index and future forecase).
                let lat = response.coord.lat;
                let lon = response.coord.lon;
                latitude = lat;
                longitude = lon;

                $('#currentIcon').attr('src', 'https://openweathermap.org/img/wn/' + response.weather[0].icon + '@2x.png');
                $('#temperature').text(`Temperature: ${tempF.toFixed(1)} °F`);
                $('#humidity').text(`Humidity: ${humidity}%`);
                $('#windSpeed').text(`Wind Speed: ${windspeed} MPH`);

                // This function call gets the UV index and future forecast
                getFutureWeather();
            });
    };
    function getFutureWeather() {
        //fetch api 
     fetch(
         "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=minutely,hourly&appid=8f62257571888eedbb0ada9d2502e1fa"
         
     )
         .then(function (response) {
             return response.json();
         })
         .then(function (response) {
             console.log("api response2", response);
             
 
             // This empties the forecastCards Div so it can be populated with new information every time this function is called.
             $('#futureCards').empty();
 
             fiveDayForecast = $('<h2>');
             fiveDayForecast.text('5-Day Forecast:');
             $('#futureCards').prepend(fiveDayForecast);
             
             hrTag = $('<hr>');
             $('#futureCards').prepend(hrTag);
 
             // This iterates through the 5 forecast cards and populates each with information for the next 5 days.
             for (let i = 1; i < 6; i++){
                 // Taken from the moment.js documentation, this converts the response.daily.dt value to a readable date.
                 let timestamp = moment.unix(response.daily[i].dt).format("MM/DD/YYYY");
                 // creates all of the elements in each of the forecast cards and gives the cards necessary attributes and values.
                 let forecastCardDiv = $('<div>');
                 let forecastCard = $('<div>');
                 let forecastDate = $('<h5>');
                 let forecastTemp = $('<p>');
                 let forecastHumidity = $('<p>');
                 let forecastIcon = $('<img>');
                 forecastCardDiv.attr('class', 'card text-white bg-primary mb-3');
                 forecastCardDiv.attr('style', 'max-width: 18rem; float: left; width: 180px; height: 235px; margin-right:10px;');
                 forecastCardDiv.attr('id', `card${i}`);
                 
                 forecastCard.attr('class', 'card-body');
                 forecastCardDiv.append(forecastCard);
                 
                 forecastDate.attr('class', 'card-title');
 
                 forecastDate.text(timestamp);
                 forecastIcon.attr('src', 'https://openweathermap.org/img/wn/' + response.daily[i].weather[0].icon + '@2x.png');
                 let forecastTempK = response.daily[i].temp.max;
                 let forecastTempF = ((forecastTempK - 273.15)*9/5) + 32;
                 forecastTemp.text(`Temp: ${forecastTempF.toFixed(1)} °F`);
                 forecastHumidity.text(`Humidity: ${response.daily[i].humidity}%`);
                 
                 forecastCard.append(forecastDate);
                 forecastCard.append(forecastIcon);
                 forecastCard.append(forecastTemp);
                 forecastCard.append(forecastHumidity);
                 
                 $('#fiveday-header').append(forecastCardDiv);   
             }
 
 
         })}


    // Get history from local storage if any
    searchEl.addEventListener("click", function () {
        const searchTerm = cityEl.value;
        getWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        renderSearchHistory();
    })
    
        // Clear History button
        clearEl.addEventListener("click", function () {
            localStorage.clear();
            searchHistory = [];
            renderSearchHistory();
        })
    

    function k2f(K) {
        return Math.floor((K - 273.15) * 1.8 + 32);
    }
/*
    function renderSearchHistory() {
        historyEl.innerText = "yes";
        for (let i = 0; i < searchHistory.length; i++) {
            const historyItem = document.createElement("input");
            historyItem.setAttribute("type", "text");
            historyItem.setAttribute("readonly", true);
            historyItem.setAttribute("class", "form-control d-block bg-white");
            historyItem.setAttribute("value", searchHistory[i]);
            historyItem.addEventListener("click", function () {
                getWeather(historyItem.value);
            })
            historyEl.append(historyItem);
        }
    }
*/
    renderSearchHistory();
    if (searchHistory.length > 0) {
        getWeather(searchHistory[searchHistory.length - 1]);
    }
};

    

initPage();