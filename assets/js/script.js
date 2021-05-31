// Listener for Nav bar
//document.addEventListener('DOMContentLoaded', function() {
  //    var elems = document.querySelectorAll('.sidenav');
  //  var instances = M.Sidenav.init(elems, options);
  //});

// save search results in local storage 

// function for weatehr api 
function getWeather() {
  var searchCity = $("#searchCity").val();

 //fetch api wether
 fetch(
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
    var searchCity = $("#searchCity").val();
   //fetch api locatiob
   fetch(
    "//maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" +
     //searchCity +

     // need to create key 
    "&key="
)
    .then(function (response) {
        return response.json();
    })
    .then(function (response) {
        console.log("api response2", response);
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