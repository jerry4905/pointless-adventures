// function for weatehr api 
function getWeather() {
  //pull city to add to fetch
  var searchCity = $("#searchCity").val();

 //fetch api wether
 fetch(
   //set to paris 
  "https://api.openweathermap.org/data/2.5/forecast?q=paris" +
   //searchCity +
  "&appid=8f62257571888eedbb0ada9d2502e1fa"
)
  .then(function (response) {
      return response.json();
  })
  .then(function (response) {
      console.log("api response1", response);
  });
}

// function for locations api 
  function getActivities() {
    //pull input to add to fetch
    var searchCity = $("#searchCity").val();
   //fetch api locatiob
   fetch(
     //set to golf
    "//maps.googleapis.com/maps/api/place/findplacefromtext/json?input=golf" +
     //searchCity +

     // google  key 
    "&key=AIzaSyB2e7r9Fv_XJv1LXHlpE8jVRm2EbljKKxQ"
)
    .then(function (response) {
        return response.json();
    })
    .then(function (response) {
        console.log("api response2", response);
    });
  }

  // function for fightsapi 
  function getFlights() {
    //pull city to add to fetch
    var searchCity = $("#searchCity").val();
   //fetch api locatiob
   fetch(
     // need correct api with endpoint
    "" +

     // need to create key 
    "&key="
)
    .then(function (response) {
        return response.json();
    })
    .then(function (response) {
        console.log("api response3", response);
    });
  }

  // add on click event to access fetch weather
  $("#weather").on("click", function () {
    getWeather();
});
  // add on click event to access fetch locations
  $("#places").on("click", function () {
    getActivites();
});
 // add on click event to access fetch flgiths
 $("#flights").on("click", function () {
  getFlights();
});