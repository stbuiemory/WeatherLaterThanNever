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
  var urlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&appid=" + apiKey + "&units=imperial";
  // Variable for 5 day forecast working
  var urlFiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&appid=" + apiKey + "&units=imperial";

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
      var urlUV = `https://api.openweathermap.org/data/2.5/uvi?=${apiKey}&lat=${response.coord.lat}&lon=${response.coord.lon}`;

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
        function fiveDayForecast(cityName) {
  var apiKey = "2466179abae5396cbf0ee459a53acfe6";
  var urlFiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey + "&units=imperial";

  $.ajax({
    url: urlFiveDay,
    method: "GET",
  }).then(function (response) {
    $("#fiveDay").empty();
    var data = response.list;
    for (var i = 0; i < data.length; i++) {
      if (data[i].dt_txt.indexOf("15:00:00") !== -1) {
        var date = new Date(data[i].dt_txt);
        var card = $("<div>").addClass("card bg-primary text-white");
        var cardBody = $("<div>").addClass("card-body p-2");
        var cityDate = $("<h5>").addClass("card-title").text(date.toLocaleDateString("en-US"));
        var temperature = $("<p>").addClass("card-text").text("Temp: " + data[i].main.temp_max + " °F");
        var humidity = $("<p>").addClass("card-text").text("Humidity: " + data[i].main.humidity + "%");

        var image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data[i].weather[0].icon + ".png");

        cardBody.append(cityDate, image, temperature, humidity);
        card.append(cardBody);
        $("#fiveDay").append(card);
      }
    }
  });
}
