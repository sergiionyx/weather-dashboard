const keyApi = "dc404097273822a047bc3d11dfcf3f4b";
var city = "Charlotte";
var cityName;
var temp;
var wind;
var humid;
var uv;


var apiReqByCityName = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + keyApi;

function getData(apiUrl) {
    fetch(apiUrl)
        .then(function (response) {
            // successful request 
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    //city name
                    cityName = data.city.name.trim();
                    temp = data.list[0].main.temp;
                    wind = data.list[0].wind.speed;
                    humid = data.list[0].main.humidity;
                    //get coordinates to make a call for uv index
                    var lat = data.city.coord.lat;
                    var lon = data.city.coord.lon;
                    getOtherData(lat, lon);

                    console.log(cityName);
                    //temperature degrees F
                    console.log(data.list[0].main.temp);
                    //wind mph
                    console.log(data.list[0].wind.speed);
                    //humidity %
                    console.log(data.list[0].main.humidity);
                    //localStorage.setItem(cityName, JSON.stringify(data));
                });
            } else {
                alert('Error: City Not Found');
            }
        })
        .catch(function (error) {
            alert("Unable to connect to Weather API");
        });
        displayData();
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
                console.log(data);
                console.log(data.daily[0].uvi);
            });
        } else {
            alert('Error: City Not Found');
        }
    })
    .catch(function (error) {
        alert("Unable to connect to Weather API");
    });
}

function displayData() {

}



getData(apiReqByCityName);
// console.log(apiData);
// getOtherData(apiData);