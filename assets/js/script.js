/*

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
    "&key=4745689b98msh209d8b30edd50e1p1d121cjsn68235fc24baa"
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

// Maps portion

function initAutocomplete() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 48,
      lng: 4
    },
    zoom: 4,
    disableDefaultUI: true
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('my-input-searchbox');
  var autocomplete = new google.maps.places.Autocomplete(input);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
  var marker = new google.maps.Marker({
    map: map
  });

  // Bias the SearchBox results towards current map's viewport.
  autocomplete.bindTo('bounds', map);
  // Set the data fields to return when the user selects a place.
  autocomplete.setFields(
    ['address_components', 'geometry', 'name']);

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      console.log("Returned place contains no geometry");
      return;
    }
    var bounds = new google.maps.LatLngBounds();
    marker.setPosition(place.geometry.location);

    if (place.geometry.viewport) {
      // Only geocodes have viewport.
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }
    map.fitBounds(bounds);
  });
}
document.addEventListener("DOMContentLoaded", function(event) {
  initAutocomplete();
});