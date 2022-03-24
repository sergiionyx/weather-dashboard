const keyApi = "dc404097273822a047bc3d11dfcf3f4b";
var cityName;
var temp;
var wind;
var humid;
var uv;
var weather = [];
var cityInputEl = document.getElementById("city");
var searchBtnEl = document.getElementById("search");


function getData(event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();
    var apiReqByCityName = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + keyApi;
    fetch(apiReqByCityName)
        .then(function (response) {
            // successful request 
            if (response.ok) {
                response.json().then(function (data) {
                    //get city name
                    cityName = data.city.name.trim();
                    temp = data.list[0].main.temp;
                    wind = data.list[0].wind.speed;
                    humid = data.list[0].main.humidity;
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

function getOtherData(lat, lon) {
    //api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
    var apiReqByLonLat = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + keyApi;
    fetch(apiReqByLonLat)
        .then(function (response) {
            // successful request 
            if (response.ok) {
                response.json().then(function (data) {
                    uv = data.daily[0].uvi;
                    saveData();
                });
            } else {
                alert('Error: City Not Found');
            }
        })
        .catch(function (error) {
            alert("Unable to connect to Weather API");
        });
}

function saveData() {
    //create obj with weather data
    var cityObj = {
        name: cityName,
        temp: temp,
        wind: wind,
        humid: humid,
        uv: uv
    }

    // Get the existing data
    weather = localStorage.getItem('weather');

    // If no existing data, create an array
    // Otherwise, convert the localStorage string to an array
    weather = weather ? JSON.parse(weather) : [];
    
    // Add new data to localStorage Array
    weather.push(cityObj);
    // Save back to localStorage
    localStorage.setItem("weather", JSON.stringify(weather));
    displayData(weather);
}

function displayData(weather) {
    console.log(weather);
    

}


searchBtnEl.addEventListener("click", getData);

//displayData();