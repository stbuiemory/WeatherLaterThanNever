let APIKey = "2466179abae5396cbf0ee459a53acfe6";
let locations = [];

// Build URL to query weather API using the geographical coordinates and API key.
var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=,minutely,hourly,alerts&appid=" + APIKey;

// Make an AJAX call to the OpenWeatherMap API using the constructed URL.
$.ajax({
    url: queryURL,
    method: "GET"
})

// Once the data has been retrieved, store it in response and pass it to the showWeatherData function.
.then(function (response) {
        showWeatherData(response, city);
    });           


 //Call the weather API based on zip and call the function showWeatherData to load the values
function loadWeatherZip(zipCpde, isClicked) {

    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?zip=" + zipCpde + ",us&appid=" + APIKey;
    var weatherContainer = $("#weatherContainer");

    // Run AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) { 

            console.log(response);

            if (!isClicked)
            {
                saveLocations(response);  //City and zip saved to local storage
                renderLocations();
            }


            //Load weather
            getWeatherData(response.city.coord.lat, response.city.coord.lon, response.city.name);

        }).catch(function (response){
            alert("Not a vaild Zip Code")
        });
}

function loadWeatherCity(city, isClicked) {
    
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + ",us&appid=" + APIKey;
    var weatherContainer = $("#weatherContainer");

    // Run AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        
        .then(function (response) {

            console.log(response);

            if (!isClicked)
            {
                saveLocations(response);  //City and zip saved to local storage
                renderLocations();
            }

            //Load weather
            getWeatherData(response.city.coord.lat, response.city.coord.lon, response.city.name);

        }).catch(function(response){
            alert("Not a valid City");
        });
}

function showWeatherData(weatherData, city)
{
    //Load current
    var iconURL = "http://openweathermap.org/img/w/" + weatherData.current.weather[0].icon + ".png";  
    $("#cityDate").html(city + " (" + new Date().toLocaleDateString() + ") <img id=\"icon\" src=\"" + iconURL  + "\" alt=\"Weather icon\"/>");

    var temp = parseInt(weatherData.current.temp);
    temp = Math.round(((temp-273.15)*1.8) + 32);
    $("#currentTemp").html(" " + temp +  "  &degF");
    $("#currentHumidity").html(weatherData.current.humidity + "%");
    $("#currentWindSpeed").html(weatherData.current.wind_speed + " MPH");

    //Current uv index and store in the uvIndex.current array 
    var uvIndex = weatherData.current.uvi;

    var bgColor = "";  //Background color for UV Index
    var textColor = "";  //Text color for UV Index

    if (uvIndex < 3) //If uv index is low (1-2)
    {
        bgColor = "bg-success";
        textColor = "text-light";  
    }
    else if (uvIndex > 2 && uvIndex < 6)  //If uv index is mocerate (3-5)
    {
        bgColor = "bg-warning";
        textColor = "text-dark";             
    }
    else  //If uv index is high (6+)
    {
        bgColor = "bg-danger";
        textColor = "text-light";            
    }

    $("#currentUVIndex").html(uvIndex).addClass(bgColor + " p-1 " +  textColor); //Set the UVIndex and color to the html


    //Load 5 Day forecast
    var ul5 = $("#fiveDay");
    ul5.empty();

    for (i=1; i < 6; i++) 
    {
        
        var div = $("<div>").addClass("bg-primary");

        var dateTime = parseInt(weatherData.daily[i].dt); 
        var dateHeading = $("<h6>").text(new Date(dateTime * 1000).toLocaleDateString());  
        var iconDayURL = "http://openweathermap.org/img/w/" + weatherData.daily[i].weather[0].icon + ".png"; 
        var icon = $("<img>").attr("src", iconDayURL);

        temp = parseInt(weatherData.daily[i].temp.day);  
        temp = Math.round(((temp-273.15)*1.8) + 32);  
        var temp5 = $("<p>").html("Temp: " + temp +  "  &degF");

        var humidity5 = $("<p>").html("Humidity: " + weatherData.daily[i].humidity + "%");

        div.append(dateHeading);
        div.append(icon);
        div.append(temp5);
        div.append(humidity5);
        ul5.append(div);

    }

    $("#weatherData").show();
}

//Load locations from local storage to the locations array
function loadLocations()
{
    var locationsArray = localStorage.getItem("locations");
    if (locationsArray) //If not undefined
    {
      locations = JSON.parse(locationsArray);  
      renderLocations();
    }
    else {
      localStorage.setItem("locations", JSON.stringify(locations));  
    }
}

function renderLocations()
{
    var divLocations = $("#locationHistory");
    divLocations.empty();  

    // Loop through each city in the locations array and create a link element for it with city name as text content
$.each(locations, function(index, item){
    var a = $("<a>").addClass("list-group-item list-group-item-action city").attr("data-city", locations[index]).text(locations[index]);
    // Append each link element to the locationHistory div
    divLocations.append(a);
});

// Remove any existing click event handlers on link elements in locationHistory div
$("#locationHistory > a").off();

// Add click event handlers to each link element in locationHistory div to load weather for that city
$("#locationHistory > a").click(function (event)
{   
    var element = event.target;
    var city = $(element).attr("data-city");

    // Load weather for the selected city and set the flag to true to indicate that it is a saved city
    loadWeatherCity(city, true);
    });

}

//Save locations to array and local storage
function saveLocations(data)
{

    var city = data.city.name;

    locations.unshift(city);
    localStorage.setItem("locations", JSON.stringify(locations)); 

}

$(document).ready(function () {
    // Hide the weather data element by default
    $("#weatherData").hide();  
    // Load any previously saved locations from local storage
    loadLocations();  
    // When the search button is clicked, get the search criteria and load the weather data
    $("#searchBtn").click(function (event) {  
        var element = event.target; 
        var searchCriteria = $("#zipCode").val();  
        // If the search criteria is not blank
        if (searchCriteria !== "")  
        {
            // Attempt to parse the search criteria as a zip code
            var zip = parseInt(searchCriteria); 
            // If it is a valid zip code
            if (!isNaN(zip)) 
            {
                // Load the weather data using the zip code
                loadWeatherZip(zip, false);
            }
            // If it is not a valid zip code, assume it is a city name
            else
            {
                // Load the weather data using the city name
                loadWeatherCity(searchCriteria, false);  
            }
        }
    });
});