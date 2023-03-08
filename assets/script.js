// Variables 
var searchButton = $("#searchBtn");

var apiKey = "2466179abae5396cbf0ee459a53acfe6";

// Forloop for persisting the data onto HMTL page
for (var i = 0; i < localStorage.length; i++) {

    var city = localStorage.getItem(i);
    // console.log(localStorage.getItem("City"));
    var cityName = $(".list-group").addClass("list-group-item");

    cityName.append("<li>" + city + "</li>");
}
// Key count for local storage
var keyCount = 0;

// Search button click event
searchButton.click(function () {
  var searchInput = $(".searchInput").val();

  // Variable for current weather working 
  var urlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&Appid=" + apiKey + "&units=imperial";
  // Variable for 5 day forecast working
  var urlFiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&Appid=" + apiKey + "&units=imperial";

  if (searchInput == "") {
    console.log(searchInput);
  } else {
    $.ajax({
      url: urlCurrent,
      method: "GET"
    }).then(function (response) {
      // list-group append an li to it with just set text
      // console.log(response.name);
      var cityName = $("<li>").addClass("list-group-item");
      cityName.text(response.name);
      $(".list-group").append(cityName);

      // Local storage
      localStorage.setItem(keyCount, response.name);
      keyCount = keyCount + 1;

      // Start Current Weather append 
      var currentCard = $("<div>").addClass("card-body");
      $("#currentWeather").empty().append(currentCard);

      var currentName = $("<p>");
      currentCard.append(currentName);

      // Adjust Date 
      var timeUTC = new Date(response.dt * 1000);
      currentName.append(response.name + " " + timeUTC.toLocaleDateString("en-US"));
      currentName.append(`<img src="https://openweathermap.org/img/wn/${response.weather[0].icon}.png">`);

      // Add Temp 
      var currentTemp = $("<p>");
      currentName.append(currentTemp);
      currentTemp.append("Temperature: " + response.main.temp + " °F");

      // Add Humidity
      currentTemp.append("<br>Humidity: " + response.main.humidity + "%");

      // Add Wind Speed: 
      currentTemp.append("<br>Wind Speed: " + response.wind.speed + " MPH");

      // UV Index URL
      var urlUV = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${response.coord.lat}&lon=${response.coord.lon}`;

      // UV Index
      $.ajax({
        url: urlUV,
        method: "GET"
      }).then(function (response) {
        var currentUV = $("<p>").addClass("card-text UV");
        currentUV.text("UV Index: " + response.value);
        currentTemp.append(currentUV);
      });
    });
  }
});

        // Start call for 5-day forecast 
        $.ajax({
            url: urlFiveDay,
            method: "GET"
          }).then(function (response) {
            // Loop through the response to get the forecast data
            for (var i = 0; i < response.list.length; i++) {
              // Get the forecast data for each day
              var forecastData = response.list[i];
              // Create a card for the forecast
              var forecastCard = $("<div>").addClass("card");
              // Create a card body for the forecast
              var forecastCardBody = $("<div>").addClass("card-body");
              // Add the date to the card body
              var forecastDate = $("<h6>").addClass("card-title").text(moment.unix(forecastData.dt).format("MM/DD/YYYY"));
              forecastCardBody.append(forecastDate);
              // Add the weather icon to the card body
              var forecastIcon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + forecastData.weather[0].icon + ".png");
              forecastCardBody.append(forecastIcon);
              // Add the temperature to the card body
              var forecastTemp = $("<p>").addClass("card-text").text("Temp: " + forecastData.main.temp + " °F");
              forecastCardBody.append(forecastTemp);
              // Add the humidity to the card body
              var forecastHumidity = $("<p>").addClass("card-text").text("Humidity: " + forecastData.main.humidity + "%");
              forecastCardBody.append(forecastHumidity);
              // Add the card body to the card
              forecastCard.append(forecastCardBody);
              // Add the card to the HTML
              $("#fiveDay").append(forecastCard);
            }
          });