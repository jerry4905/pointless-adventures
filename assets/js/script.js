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

// get User Input when trip search is submitted
$("#submit-btn").on("click", function (event) {
  event.preventDefault();
  // save user inputs to variables
  startingLocation = $(".from-city").val().trim()
  endingLocation = $(".to-city").val().trim()
  outboundDate = $("#outbound-date").val().trim()
  inboundDate = $("#inbound-date").val().trim()

  // error handling
  if (startingLocation === "" || endingLocation === "") {
      M.toast({ html: 'Please select your locations.' })
  }
  if (outboundDate === "" || inboundDate === "") {
      M.toast({ html: 'Please select your dates.' })
  }
  if (inboundDate < outboundDate) {
      M.toast({ html: 'Inbound date must be after outbound date.' })
  }
  if (inboundDate === outboundDate) {
      M.toast({ html: 'Outbound and inbound date cannot be the same date.' })
  }
  if ((startingLocation != "") &
      (endingLocation != "") &
      (outboundDate != "") &
      (inboundDate != "") &
      (inboundDate > outboundDate)) {
       getTravelQuotes();
  }
})

// fetch call for flight options
var getTravelQuotes = function () {
    var myHeaders = new Headers();
    myHeaders.append("x-rapidapi-key", "69f0fc9e9cmsh8a73231b70d1caep1270a7jsnd11560f94399");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/US/USD/en-US/" + startingLocation + "-sky/" + endingLocation + "-sky/" + outboundDate + "?inboundpartialdate=" + inboundDate, requestOptions)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    getTravelOptions(data);
                });
            } else {
                M.toast({ html: 'ERROR: Unable to gather data. Please ensure you are searching by valid airport codes.'});
                return; 
            }
        })
        .catch(function () {
            M.toast({ html: 'ERROR: Unable to connect and gather flight routes' })
        })
};

// load flight options to page
function getTravelOptions(data) {
    var googleFlightUrl = ("https://www.google.com/flights?hl=en#flt=" + startingLocation + "." + endingLocation + "." + outboundDate + "*" + endingLocation + "." + startingLocation + "." + inboundDate + ";c:USD;e:1;sd:1;t:f");

    // override previous search
    $("#flight-options").html("");
    $("#flight-cities").text((startingLocation.toUpperCase()) + " - " + (endingLocation.toUpperCase()));
    $("#flight-dates").text(outboundDate + " to " + inboundDate);

    // loop through all carriers
    for (var i = 0; i < data.Carriers.length; i++) {
        console.log(data.Carriers[i].Name + ' flight price options:');

        var listItem = $("<li>").addClass("white-text blue3")
        var airlineTitle = $("<div>").addClass("collapsible-header blue3");
        var airlineName = $("<h5>").text(data.Carriers[i].Name);
        var icon = $("<i>").addClass("material-icons right").text("arrow_drop_down")
        airlineName.append(icon);
        airlineTitle.append(airlineName);

        var airlineBody = $("<div>").addClass("collapsible-body");
        var table = $("<table>").addClass("centered highlight blue3");
        var thead = $("<thead>").attr('id', 'thead');
        var trhead = $("<tr>").attr('id', 'trhead');
        var priceTitle = $("<th>").text("Price");
        var directTitle = $("<th>").text("Direct flight");

        table.append(thead.append(trhead.append(priceTitle, directTitle)));
        airlineBody.append(table);
        listItem.append(airlineTitle,airlineBody);
        $("#flight-options").append(listItem);


        var priceList = [];
        // loop through all quotes
        for (var j = 0; j < data.Quotes.length; j++) {
            // check for same carrier id
            if (data.Carriers[i].CarrierId === data.Quotes[j].OutboundLeg.CarrierIds[0]) {
                // if price is not repeated
                if (!priceList.includes(data.Quotes[j].MinPrice)) {
                    priceList.push(data.Quotes[j].MinPrice)
                    console.log("$" + data.Quotes[j].MinPrice + " Direct: " + data.Quotes[j].Direct)
                    // add prices and direct flight to table
                    var tbody = $("<tbody>").attr('id', 'tbody');
                    var trbody = $("<tr>").attr('id', 'trbody');
                    var flightPrice = $("<td>").text("$" + data.Quotes[j].MinPrice);
                    var directFlight = $("<td>").attr('id', 'directFlight');
                    if (data.Quotes[j].Direct === true) {
                        directFlight.text("Yes");
                    } else {
                        directFlight.text("No");
                    }
                }

                table.append(tbody.append(trbody.append(flightPrice, directFlight)));
                
                $(document).ready(function() {
                $("tbody").click(function() {
                    $(this).attr("href");
                    window.open(googleFlightUrl,'_blank');
                    });
                });
            }
        }
    }

}
// fetch call for flight options
var getTravelQuotes = function () {
  var myHeaders = new Headers();
  myHeaders.append("x-rapidapi-key", "4745689b98msh209d8b30edd50e1p1d121cjsn68235fc24baa");

  var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
  };

  fetch("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/US/USD/en-US/" + startingLocation + "-sky/" + endingLocation + "-sky/" + outboundDate + "?inboundpartialdate=" + inboundDate, requestOptions)
      .then(function (response) {
          if (response.ok) {
              response.json().then(function (data) {
                  getTravelOptions(data);
              });
          } else {
              M.toast({ html: 'ERROR: Unable to gather data. Please ensure you are searching by valid airport codes.'});
              return; 
          }
      })
      .catch(function () {
          M.toast({ html: 'ERROR: Unable to connect and gather flight routes' })
      })
};

// load flight options to page
function getTravelOptions(data) {
  var googleFlightUrl = ("https://www.google.com/flights?hl=en#flt=" + startingLocation + "." + endingLocation + "." + outboundDate + "*" + endingLocation + "." + startingLocation + "." + inboundDate + ";c:USD;e:1;sd:1;t:f");

  // override previous search
  $("#flight-options").html("");
  $("#flight-cities").text((startingLocation.toUpperCase()) + " - " + (endingLocation.toUpperCase()));
  $("#flight-dates").text(outboundDate + " to " + inboundDate);

  // loop through all carriers
  for (var i = 0; i < data.Carriers.length; i++) {
      console.log(data.Carriers[i].Name + ' flight price options:');

      var listItem = $("<li>").addClass("white-text blue3")
      var airlineTitle = $("<div>").addClass("collapsible-header blue3");
      var airlineName = $("<h5>").text(data.Carriers[i].Name);
      var icon = $("<i>").addClass("material-icons right").text("arrow_drop_down")
      airlineName.append(icon);
      airlineTitle.append(airlineName);

      var airlineBody = $("<div>").addClass("collapsible-body");
      var table = $("<table>").addClass("centered highlight blue3");
      var thead = $("<thead>").attr('id', 'thead');
      var trhead = $("<tr>").attr('id', 'trhead');
      var priceTitle = $("<th>").text("Price");
      var directTitle = $("<th>").text("Direct flight");

      table.append(thead.append(trhead.append(priceTitle, directTitle)));
      airlineBody.append(table);
      listItem.append(airlineTitle,airlineBody);
      $("#flight-options").append(listItem);


      var priceList = [];
      // loop through all quotes
      for (var j = 0; j < data.Quotes.length; j++) {
          // check for same carrier id
          if (data.Carriers[i].CarrierId === data.Quotes[j].OutboundLeg.CarrierIds[0]) {
              // if price is not repeated
              if (!priceList.includes(data.Quotes[j].MinPrice)) {
                  priceList.push(data.Quotes[j].MinPrice)
                  console.log("$" + data.Quotes[j].MinPrice + " Direct: " + data.Quotes[j].Direct)
                  // add prices and direct flight to table
                  var tbody = $("<tbody>").attr('id', 'tbody');
                  var trbody = $("<tr>").attr('id', 'trbody');
                  var flightPrice = $("<td>").text("$" + data.Quotes[j].MinPrice);
                  var directFlight = $("<td>").attr('id', 'directFlight');
                  if (data.Quotes[j].Direct === true) {
                      directFlight.text("Yes");
                  } else {
                      directFlight.text("No");
                  }
              }

              table.append(tbody.append(trbody.append(flightPrice, directFlight)));

              $(document).ready(function() {
              $("tbody").click(function() {
                  $(this).attr("href");
                  window.open(googleFlightUrl,'_blank');
                  });
              });
          }
      }
  }

}