let APIKey = "166a433c57516f51dfab1f7edaed8413";
let city = "";
let currentDate = "";
let tempF = "";
let humidityValue = "";
let windSpeed = "";
let uvIndexValue = "";
let latitude = "";
let longitude = "";
let minTempK = "";
let maxTempK = "";
let minTempF = "";
let maxTempF = "";
let dayHumidity = "";
let currentWeatherIconCode = "";
let currentWeatherIconUrl = "";
let iconCode = "";
let iconUrl = "";
let country = "";

let searchedCitiesList = [];

let searchedCities = JSON.parse(localStorage.getItem("searched-cities"));
if (searchedCities !== null) {
  searchedCities.forEach(function(city) {city.toUpperCase();});
  searchedCitiesList = searchedCities;  
}

$(document).ready(function(){
  displayCities(searchedCitiesList);
  if (searchedCities !== null) {
    let lastCity = searchedCitiesList[0];
    searchCity(lastCity);
  }
});

$("#search-btn").on("click", function() {
  event.preventDefault();
  clearDisplayedWeatherInfo()
  resetGlobalVariables()
  let cityName = $("input").val().toUpperCase().trim();
  $("#search-input").val("");
  searchCity(cityName);

  if (cityName !== ""&& searchedCitiesList[0] !== cityName) {
    searchedCitiesList.unshift(cityName);
    localStorage.setItem("searched-cities", JSON.stringify(searchedCitiesList));
    if (searchedCitiesList.length === 1) {
      $("#searched-cities-card").removeClass("hide");
    }
    
    if ($("ul#searched-cities-list a").length >= 5) {
      ($("ul#searched-cities-list a:eq(4)").remove());
    }
    $("#searched-cities-list").prepend(`<a href="#" class="list-group-item" style="text-decoration: none; color: black;">
    <li>${cityName}</li>
    </a>`);
  }
});

$(document).on("click", ".list-group-item", function() {
  let cityName = $(this).text();
  clearDisplayedWeatherInfo();
  resetGlobalVariables();
  searchCity(cityName);
});

function displayCurrentWeather() {
  let cardDiv = $("<div class='container border bg-light'>");
  let weatherImage = $("<img>").attr('src', currentWeatherIconUrl);
  let cardHeader = $("<h4>").text(city + " " + currentDate.toString());
  cardHeader.append(weatherImage);
  let temperatureEl = $("<p>").text("Temperature: " + tempF+ " ºF");
  let humidityEl = $("<p>").text("Humidity: " + humidityValue + "%");
  let windSpeedEl = $("<p>").text("Wind Speed: " + windSpeed + " MPH");
  let uvIndexEl = $("<p>").text("UV Index: ");
  let uvIndexValueEl = $("<span>").text(uvIndexValue).css("background-color", getColorCodeForUVIndex(uvIndexValue)); 
  uvIndexEl.append(uvIndexValueEl);
  cardDiv.append(cardHeader);
  cardDiv.append(temperatureEl);
  cardDiv.append(humidityEl);
  cardDiv.append(windSpeedEl);
  cardDiv.append(uvIndexEl);
  $("#current-weather-conditions").append(cardDiv);
}

function displayDayForeCast() { 
  let imgEl = $("<img>").attr("src", iconUrl);  
  let cardEl = $("<div class='card'>").addClass("pl-1 bg-primary text-light");
  let cardBlockDiv = $("<div>").attr("class", "card-block");
  let cardTitleDiv = $("<div>").attr("class", "card-block");
  let cardTitleHeader = $("<h6>").text(dateValue).addClass("pt-2");
  let cardTextDiv = $("<div>").attr("class", "card-text");
  let minTempEl = $("<p>").text("Min Temp: " + minTempF + " ºF").css("font-size", "0.60rem");
  let maxTempEl = $("<p>").text("Max Temp: " + maxTempF + " ºF").css("font-size", "0.60rem");
  let humidityEl = $("<p>").text("Humidity: " + dayHumidity + "%").css("font-size", "0.60rem");

  cardTextDiv.append(imgEl);
  cardTextDiv.append(minTempEl);
  cardTextDiv.append(maxTempEl);
  cardTextDiv.append(humidityEl);
  cardTitleDiv.append(cardTitleHeader);
  cardBlockDiv.append(cardTitleDiv);
  cardBlockDiv.append(cardTextDiv);
  cardEl.append(cardBlockDiv);
  $(".card-deck").append(cardEl);
}

function addCardDeckHeader() {
  deckHeader = $("<h4>").text("5-Day Forecast").attr("id", "card-deck-title");
  deckHeader.addClass("pt-4 pt-2");
  $(".card-deck").before(deckHeader);
}

function clearDisplayedWeatherInfo() {
  $("#current-weather-conditions").empty();
  $("#card-deck-title").remove();
  $(".card-deck").empty();
}

function displayCities(citiesList) {
  $("#searched-cities-card").removeClass("hide");
    let count = 0;
  citiesList.length > 5 ? count = 5 : count = citiesList.length
  for (let i=0; i < count; i++) {
    $("#searched-cities-list").css("list-style-type", "none");
    $("#searched-cities-list").append(`<a href="#" class="list-group-item" style="text-decoration: none; color: black;">
    <li>${citiesList[i]}</li>
    </a>`);
  }
}

function getColorCodeForUVIndex(uvIndex) {
  let uvIndexValue = parseFloat(uvIndex);
  let colorcode = "";
  if (uvIndexValue <= 2) {
    colorcode = "#00ff00";
  }
  else if ((uvIndexValue > 2) && (uvIndexValue <= 5)) {
    colorcode = "#ffff00";
  }
  else if ((uvIndexValue > 5) && (uvIndexValue <= 7)) {
    colorcode = "#ffa500";
  }
  else if ((uvIndexValue > 7) && (uvIndexValue <= 10)) {
    colorcode = "#9e1a1a";
  }
  else if (uvIndexValue > 10) {
    colorcode = "#7f00ff";
  }
  return colorcode;
}

function resetGlobalVariables() {
  city = "";
  currentDate = "";
  tempF = "";
  humidityValue = "";
  windSpeed = "";
  uvIndexValue = "";
  latitude = "";
  longitude = "";
  minTempK = "";
  maxTempK = "";
  minTempF = "";
  maxTempF = "";
  dayHumidity = "";
  currentWeatherIconCode = "";
  currentWeatherIconUrl = "";
  iconCode = "";
  iconUrl = "";
  country = "";
}


function searchCity(cityName){
 // build URL to query the database
 let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;

 // run the AJAX call to the OpenWatherAPI
 $.ajax({
   url: queryURL,
   method: "GET"
 })

 // store all of the retrieved data inside of an object called "response"
 .then(function(response) {
   let result = response;
   city = result.name.trim();
  // let countryCode = result.sys.country;
  //  country = getCountryName(countryCode).trim();
  //  currentDate = moment().tz(country + "/" + city).format('l');
  currentDate = moment.unix(result.dt).format("l");
   let tempK = result.main.temp;
   // Converts the temp to Kelvin with the below formula
   tempF = ((tempK - 273.15) * 1.80 + 32).toFixed(1);
   humidityValue = result.main.humidity;
   windSpeed = result.wind.speed;
   currentWeatherIconCode = result.weather[0].icon;
   currentWeatherIconUrl = "https://openweathermap.org/img/w/" + currentWeatherIconCode + ".png";
   let latitude = result.coord.lat;
   let longitude = result.coord.lon;
   let uvIndexQueryUrl = "https://api.openweathermap.org/data/2.5/uvi?&appid=" + APIKey + "&lat=" + latitude + "&lon=" + longitude;
   $.ajax({
     url: uvIndexQueryUrl,
     method: "GET"
   })
   .then(function(response) {
     uvIndexValue = response.value;
     displayCurrentWeather()
      
    //  5 day weather forcast
     let fiveDayQueryUrl = "https://api.openweathermap.org/data/2.5/forecast/daily?q=" + city + "&appid=" + APIKey + "&cnt=5";
     $.ajax({
       url: fiveDayQueryUrl,
       method: "GET"
     })
     .then(function(response) {
       let fiveDayForecast = response.list;
       addCardDeckHeader()
       for (let i=0; i < 5; i++) {
         iconCode = fiveDayForecast[i].weather[0].icon;
         iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";
        //  dateValue = moment().tz(country + "/" + city).add(i, 'days').format('l');
        dateValue = moment.unix(fiveDayForecast[i].dt).format('l');
         minTempK = fiveDayForecast[i].temp.min;
         minTempF =  ((minTempK - 273.15) * 1.80 + 32).toFixed(1);
         maxTempK = fiveDayForecast[i].temp.max;
         maxTempF =  (((fiveDayForecast[i].temp.max) - 273.15) * 1.80 + 32).toFixed(1);
         dayHumidity = fiveDayForecast[i].humidilet
         displayDayForeCast()
       } 
     });      
   }); 
 });
}