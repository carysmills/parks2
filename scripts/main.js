var parks = {};
parks.key = "AIzaSyBy56tqnsXQn_S0fzLB4TyGw5oa-260jRo"; 
parks.results =[];
parks.distances = [];
parks.distance = [];
parks.closehistory = [];
parks.closemarine = [];
parks.final;

//get json from separate files
parks.json = 

$.getJSON( "/scripts/marine.json", function(data) {
}).done(function(data) {
	parks.marine = data.marine;
});

$.getJSON( "/scripts/parks.json", function(data) {
}).done(function(data) {
	parks.list = data.parks;
});

$.getJSON( "/scripts//historic.json", function(data) {
}).done(function(data) {
	parks.historic = data.historic;
});

//get the data according to your variables
parks.getData = function() {
	$.ajax({ 
		url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + 
			parks.postal + "&region=ca&key=" + parks.key,
		type: "GET",
		dataType: "json",
	}).then(function(res) {
		parks.check = res;
console.log(res);
		parks.checkResults();
	});
};

//on submit, get the postal code and then run the check function
$("#address").click(function( event ) {
parks.postal = $("#postal").val();
  $("#postalc").html("");
  event.preventDefault();
  parks.getData();
});

//reset all the results, if allowing user to resubmit request
parks.clear = function(){
	parks.locations = "";
	parks.closest = "";
	parks.park = "";
	parks.low = "";
	parks.results =[];
	parks.distance = [];
	parks.closehistory = [];
	parks.closemarine = [];
	parks.historylow = "";
	parks.historyclosest = "";
	parks.history = "";
	parks.marinelow = "";
	parks.marineclosest = "";
	parks.themarine = "";
};

// display closest park
parks.display = function(){

	$("#parks").html("<img class='blockicon' src='http://www.flow.publivate.ca/images/park.png'></img><p><strong>National Park</strong> is " + parks.park + ". It is " + Math.round(parks.low) + " km away.</p>");

	$("#historic").html("<img class='blockicon' id='right' src='http://www.flow.publivate.ca/images/historic.png'></img><p><strong>National Historic Site</strong> is " + parks.history + ". It is " + Math.round(parks.historylow) + " km away.</p>");

	$("#marine").html("<img class='blockicon' src='http://www.flow.publivate.ca/images/marine.png'></img><p><strong>National Marine Conservation Area</strong> is " + parks.themarine + ". It is " + Math.round(parks.marinelow) + " km away." + "</p>");

$("#final").html("From " + parks.check.results["0"].formatted_address + ", the closest... ");
};

//the function to calculate distances between points using as the crow flies/haversine formula
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return(d);
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

//based on the results, determine whether to move forward with the parksfinder or tell user to enter proper addres
parks.checkResults = function(){
	if (parks.check.status != "OK") {
	$("#postalc").html("Please enter a valid address.");
        $("#postal").val('');
	}
	else {
		parks.getResults();
                $("#start").slideUp();
                $("#leaf").slideUp();
                $( "#next-btn-163" ).trigger( "click" );
	}
};

//check for parks that are within reach, find the closest one.
//first generate an array of how far each park, historical site and MCA are. 
// Then find the smallest one and determine which value that matches

parks.getResults = function(){
	parks.locations = parks.check.results[0].geometry.location;
	parks.latitude = parks.locations.lat;
	parks.longitude = parks.locations.lng;
	var parkNumber = parks.list.length;
	var historyNumber = parks.historic.length;
	var marineNumber = parks.marine.length;

	for (i = 0; i < parkNumber; i++) {
		parks.distance.push(getDistanceFromLatLonInKm(parks.latitude, parks.longitude, parks.list[i].lat, parks.list[i].long));
	}

	for (i = 0; i < historyNumber; i++) {
		parks.closehistory.push(getDistanceFromLatLonInKm(parks.latitude, parks.longitude, parks.historic[i].lat, parks.historic[i].long));
	}

	for (i = 0; i < marineNumber; i++) {
		parks.closemarine.push(getDistanceFromLatLonInKm(parks.latitude, parks.longitude, parks.marine[i].lat, parks.marine[i].long));
	}
		// calculate closest park
		parks.low = Math.min.apply(null, parks.distance);
		parks.closest = parks.distance.indexOf(parks.low);
		parks.park = parks.list[parks.closest].park;

		// calculate closest history
		parks.historylow = Math.min.apply(null, parks.closehistory);
		parks.historyclosest = parks.closehistory.indexOf(parks.historylow);
		parks.history = parks.historic[parks.historyclosest].park;

		// calculate closest marine
		parks.marinelow = Math.min.apply(null, parks.closemarine);
		parks.marineclosest = parks.closemarine.indexOf(parks.marinelow);
		parks.themarine = parks.marine[parks.marineclosest].park;

		//put results on the page
		parks.display();

		//clear the results
		parks.clear();  
};

$(document).ready(function() {
	parks.json;
});
