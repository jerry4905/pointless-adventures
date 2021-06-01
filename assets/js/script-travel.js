// setting global variables
var startingLocation = "";
var endingLocation = "";
var outboundDate = "";
var inboundDate = "";
var savedTripsArray = [];
var currentDate = new Date();

// function to add mo to current date
function addMonths(date, months) {
    var d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
  }

var sixMoAhead = addMonths(currentDate, 6);

$(document).ready(function () {
    $(".parallax").parallax();
});


// datepicker initialize 
$(document).ready(function () {
    $(".datepicker").datepicker({
        autoClose: true,
        minDate: new Date(),
        maxDate: sixMoAhead,
        format: "yyyy-mm-dd"
    });
});

$(document).ready(function () {
    $(".collapsible").collapsible();
});

// Display intro modal on load
$(document).ready(function () {
    $('#modal').modal();
    $('#modal').modal('open');
});

// get search term when airport code search is submitted
$("#airport-search-btn").on("click", function (event) {
    event.preventDefault();
    // get value submitted by user
    var airportCodeSearch = $("#airport-search").val().trim()
    // if blank
    if (airportCodeSearch === "") {
        M.toast({ html: 'Please enter city or country search criteria' })
    } else {
    getAirportOptions(airportCodeSearch);
    }
});

// fetch call for airport codes
var getAirportOptions = function (airportCodeSearch) {

    var myHeaders = new Headers();
    myHeaders.append("x-rapidapi-key", "69f0fc9e9cmsh8a73231b70d1caep1270a7jsnd11560f94399");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("https://tripadvisor1.p.rapidapi.com/airports/search?locale=en_US&query=" + airportCodeSearch, requestOptions)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayAirportInfo(data);
                });
            };
        })
        // if bad request
        .catch(function () {
            M.toast({ html: 'ERROR: Please update your search information' })
        })
};

// displays airport code options to page
function displayAirportInfo(data) {
    $("#airport-code-section").removeClass("hide");
    // override previous search
    $("#airport-search").text("")
    // loop through all carriers

    // card title
    var newCard = $("<div>").addClass("card card-content blue3 white-text");
    // var cardTitle = $("<span>").addClass("card-title").text(data);
    // card table
    var addRow = $("<div>").addClass("row");
    var table = $("<table>").addClass("centered highlight blue3");
    var thead = $("<thead>").attr('id', 'thead');
    var trhead = $("<tr>").attr('id', 'trhead');
    var airportCodeTitle = $("<th>").text("Airport Code");
    var airportNameTitle = $("<th>").text("Airport Name");
    var locationTitle = $("<th>").text("City, Country");

    table.append(thead.append(trhead.append(airportCodeTitle, airportNameTitle, locationTitle)));
    addRow.append(table)

    newCard.append(addRow);
    $("#airport-options").html(newCard);

    for (var i = 0; i < data.length; i++) {
        var airportName = $("<td>").text(data[i].name);
        var airportCode = $("<td>").text(data[i].code);
        var cityName = $("<td>").text(data[i].city_name + ", " + data[i].country_code);
        var countryCode = $("<td>").text(data[i].country_code);
        var fullAirportInfo = $("<td>").text(data[i].display_name);
        var tbody = $("<tbody>").attr('id', 'tbody');
        var trbody = $("<tr>").attr('id', 'trbody');
        

        table.append(tbody.append(trbody.append(airportCode, airportName, cityName)));

    };
};

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
        getTravelAdvice();
        getTravelQuotes();
    }
})


// fetch call for COVID Data
var getTravelAdvice = function () {

    var myHeaders = new Headers();
    myHeaders.append("X-Access-Token", "a9027f3b-807c-43e4-b30c-2e9f97ed1467");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    // adds user inputs into fetch call
    fetch("https://api.traveladviceapi.com/search/" + startingLocation + ":" + endingLocation + "," + endingLocation + ":" + startingLocation, requestOptions)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
 //                   addCountryData(data);
                });
            } else {
                M.toast({ html: 'ERROR: Unable to connect and gather data. Please ensure you are searching by valid airport codes.'});
            }
        })
}

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

// add trip to saved trips sidebar on click
$("#add-trip-btn").on("click", function () {

    // if savedTripsArray is empty, add saved Trip to list
    if (!(savedTripsArray.length)){
        createSavedTripLink();
    } else {
        var dup = isDuplicateTrip();
        if (dup === 0) {
            createSavedTripLink();
        } else {
            M.toast({html: 'ERROR: This trip has already been saved.'})
        }
    }
})

// checks if saved trip is a dup
var isDuplicateTrip = function () {
    var dup = 0;
    for (var i=0; i < savedTripsArray.length; i++) {
        if ((savedTripsArray[i].outboundCity === startingLocation) &&
        (savedTripsArray[i].inboundCity === endingLocation) &&
        (savedTripsArray[i].outboundDate === outboundDate) &&
        (savedTripsArray[i].inboundDate === inboundDate)) {
            dup++
        }
    }
    return dup;
}

// creates html for saved trip and saves to local storage
var createSavedTripLink = function () {
    var savedTripObj = {
        outboundCity: startingLocation,
        inboundCity: endingLocation,
        outboundDate: outboundDate,
        inboundDate: inboundDate
    }

    var savedTripLi = $("<li>")
    var savedTripLink = $("<a>").attr("href", "#").text(startingLocation + " " + endingLocation + " " + outboundDate + " " + inboundDate);

    // push that to savedTripsArray 
    savedTripsArray.push(savedTripObj);
    // save to local storage 
    localStorage.setItem("savedTrips", JSON.stringify(savedTripsArray));

    // append saved trip to page
    savedTripLi.append(savedTripLink);
    $(".saved-trips-list").append(savedTripLi);
}

// will load previously saved Trips to page
var loadSavedTrips = function () {
    // pull from local storage
    var savedTrips = JSON.parse(localStorage.getItem("savedTrips"));

    if (!savedTrips) {
        $(".saved-trips-list").html("");
        return;
    } else {
        // push to saved trips array 
        savedTripsArray = savedTrips;
        // create list element for each obj within saved Trips array
        for (var i = 0; i < savedTrips.length; i++) {
            var savedTripLi = $("<li>")
            var savedTripLink = $("<a>").attr("href", "#").text(savedTrips[i].outboundCity + " " + savedTrips[i].inboundCity + " " + savedTrips[i].outboundDate + " " + savedTrips[i].inboundDate);

            // append saved trip to page
            savedTripLi.append(savedTripLink);
            $(".saved-trips-list").append(savedTripLi);
        }
    }
}

// on button click, saved trips will be cleared
$("#clear-trips-btn").on('click', function () {
    // clear local storage
    localStorage.removeItem("savedTrips");
    // clear savedTripsArray
    savedTripsArray = [];
    loadSavedTrips();
})

$(".saved-trips-list").on('click', function (event) {
    event.preventDefault();
    if (!event.target.text) {
        return;
    } else {
        var trip = event.target.text;
        var splitTripInfo = trip.split(" ");
        startingLocation = splitTripInfo[0];
        endingLocation = splitTripInfo[1];
        outboundDate = splitTripInfo[2];
        inboundDate = splitTripInfo[3];

        getTravelAdvice();
        getTravelQuotes();
    }
})

loadSavedTrips();