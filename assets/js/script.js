const keyApi = "dc404097273822a047bc3d11dfcf3f4b";
var cityName;
var uv;
var cityInputEl = document.getElementById("city");
var searchBtnEl = document.getElementById("search");
var showWeatherDiv = document.getElementById("curentDay");
var savedCitiesEl = document.getElementById("saved-cities");

//get value from input
function getCity(event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();
    getData (city)
}

//get data from api for city name and pass to get rest info
function getData (city) {
    var apiReqByCityName = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + keyApi;
    cityInputEl.value = '';
    fetch(apiReqByCityName)
        .then(function (response) {
            // successful request 
            if (response.ok) {
                response.json().then(function (data) {
                    //get city name
                    cityName = data.city.name.trim();
                    //get coordinates to make a call for uv index
                    var lat = data.city.coord.lat;
                    var lon = data.city.coord.lon;
                    getOtherData(lat, lon);
                });
            } else {
                alert('Error: City Not Found');
            }
        })
        .catch(function (error) {
            alert("Unable to connect to Weather API");
        });
}

//get rest info
function getOtherData(lat, lon) {
    var apiReqByLonLat = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + keyApi;
    fetch(apiReqByLonLat)
        .then(function (response) {
            // successful request 
            if (response.ok) {
                response.json().then(function (data) {
                    // uv = data.daily[0].uvi;
                    saveData(data);
                });
            } else {
                alert('Error: City Not Found');
            }
        })
        .catch(function (error) {
            alert("Unable to connect to Weather API");
        });
}

//save data to local storage
function saveData(data) {
    //create obj with weather data
    var cityObj = {
        name: cityName,
        data: data
    }

    var weather = localStorage.getItem('weather');

    // If no existing data, create an array
    // Otherwise, convert the localStorage string to an array
    weather = weather ? JSON.parse(weather) : [];

    if (weather.some(e => e.name === cityName)) {
        console.log("found same city");
    }
    else {
        weather.push(cityObj);
    }
    showSavedCities(weather);
    // Save back to localStorage
    localStorage.setItem("weather", JSON.stringify(weather));
    displayData(cityObj);
}

//create elements and append them to right side of display
function displayData(cityObj) {
    console.log(cityObj);

    if (localStorage.length > 0) {
        $("#curentDay").removeClass("hide");

        // //get image data which has img-url, img-name and img-descr
        var setName = cityObj.name;
        var easyGet = cityObj.data.current;
        var setImage = easyGet.weather[0].icon;
        var iconUrl = "https://openweathermap.org/img/w/" + setImage + ".png";
        console.log(setImage);
        showWeatherDiv.innerHTML = '';

        var date = " (" + moment().format('L') + ")";
        $('#curentDay').append(
            $('<div/>')
                .attr("id", "mainDay")
                .addClass("border border-2 border-dark p-2")
                .append(
                    $('<h2/>')
                        .text(setName + date)
                        .addClass("fw-bolder")
                        .append(
                            $('<img/>')
                                .attr("src", iconUrl)
                        ),
                    $('<h5/>')
                        .text("Temp: " + easyGet.temp + " °F"),
                    $('<h5/>')
                        .text("Wind: " + easyGet.wind_speed + " MPH"),
                    $('<h5/>')
                        .text("Humidity: " + easyGet.humidity + " %"),
                    $('<h5/>')
                        .text("UV Index: ")
                        .append(
                            $('<span/>')
                                .text(easyGet.uvi)
                                .attr("id", "UV")
                        )
                )
        );

        if (easyGet.uvi < 3) {
            $('#UV')
                .addClass("uv-low")
        } else if (todayUV > 5) {
            $('#UV')
                .addClass("uv-high")
        } else {
            $('#UV')
                .addClass("uv-mid")
        }
    }
    $('#curentDay').append(
        $('<div/>')
            .attr("id", "forecast")
            .text("5-Day Forecast")
            .append(
                $('<div/>')
                    .attr("id", "row")
                    .addClass("row")
            )
    )
    var daily = cityObj.data.daily;
    console.log(daily);
    //fill up 5 day forecast
    for (let i = 1; i < 6; i++) {
        //date
        var nextDay = moment().add((i), 'days').format("L");
        //get icon code and url
        var icon = daily[i].weather[0].icon
        iconUrl = "https://openweathermap.org/img/w/" + icon + ".png";
        //create and append ul, and li items
        $('#row').append(
            $('<ul/>')
                .addClass("col-2")
                .append(
                    $('<li/>')
                        .text(nextDay),
                    $('<li/>')
                        .append(
                            $('<img/>')

                                .attr("src", iconUrl)
                        ),
                    $('<li/>')
                        .text("Temp: " + daily[i].temp.day + " °F"),
                    $('<li/>')
                        .text("Wind: " + daily[i].wind_speed + "MPH"),
                    $('<li/>')
                        .text("Humidity: " + daily[i].humidity + " %"),
                )
        )
    }
}

//load data from local storage
function loadData() {
    var weather = localStorage.getItem('weather');
    weather = weather ? JSON.parse(weather) : [];
    showSavedCities(weather);
}

//show buttons which represent saved cities
function showSavedCities(weather) {
    console.log(weather);
    savedCitiesEl.innerHTML = '';
    if (weather) {
        for (let i = 0; i < weather.length; i++) {
            var savedCity = weather[i].name;
            $('#saved-cities').append(
                $('<div/>')
                    .addClass("col-sm-12 mt-3")
                    .append(
                        $('<button/>')
                            .addClass("btn btn-secondary text-dark")
                            .text(savedCity)
                    )
            )
        }
    }
}

//get pressed button value
function showWeatherSavedCities (event) {
    event.preventDefault();
    var city = event.target.innerHTML;
    getData (city);
}

savedCitiesEl.addEventListener("click", showWeatherSavedCities)
searchBtnEl.addEventListener("click", getCity);
loadData();