// Foursquare API keys
var CLIENT_ID = "ECAQTFZ5BBRCA2SUHXOG1CJDRF442M5N3MKZGC5KAI5GZYPW";
var CLIENT_SECRET = "4V25QGAAULY2DN2CH4KYQELGQ1PXXMNZBOZIQG0FKETPJL1B";

// Google API key
var KEY = "AIzaSyCNn3TmhHr2huAKuYWaKmvWEkv3qYyvkeA";

// viewModel variable
var vm = new viewModel();

var markers = [];

var map;

/* ======= ViewModel ======= */
function viewModel (){
  var self = this;
  self.city = ko.observable("Tokyo");
  self.broth = ko.observable("Tonkotsu");
  self.locations = ko.observableArray([]);
  self.query = ko.computed(function() {
    return 'Ramen' + " " + self.broth().toString();
  });

  self.geocodeUrl = ko.computed(function() {
    return "https://maps.googleapis.com/maps/api/geocode/json?"
    + $.param({
      'key': KEY,
      'address': self.city
    })
  });

  // Create Foursquare API to populate our data
  self.fsExploreUrl = ko.computed(function() {
    return "https://api.foursquare.com/v2/venues/explore?" + $.param({
      'client_id': CLIENT_ID,
      'client_secret': CLIENT_SECRET,
      'v': getTodaysDate(),
      'limit': 10,
      'near': self.city,
      'query': self.query()
    });
  });

  populateData(self.fsExploreUrl(), self.locations);

  // reverseGeocoding(self.geocodeUrl());
};


ko.applyBindings(vm);


// Populate data with Foursquare database
function populateData(url, locations) {
  $.getJSON(url, function(data) {
    // console.log(data);
    for (i = 0 ; i < data.response.groups[0].items.length; i++) {
      locations.push(data.response.groups[0].items[i].venue);
      // console.log("lat: " + locations()[locations().length-1].location.lat);
      // console.log("lng: " + locations()[locations().length-1].location.lng);
      var position = {lat: locations()[locations().length-1].location.lat,
        lng: locations()[locations().length-1].location.lng};
      console.log(position);
      addMarkerWithTimeout(position, i * 100);
      // var marker = new google.maps.Marker({
      //   position: {lat: locations()[locations().length-1].location.lat,
      //     lng: locations()[locations().length-1].location.lng},
      //     map: map,
      //     animation: google.maps.Animation.DROP,
      //   });
    }
  }).fail(function(){
    console.log('Foursquare API Could Not Be Loaded.');
  });
}

// Return today's date in "YYYYMMDD" format for Foursquare API
function getTodaysDate() {
  var d = new Date();

  var twoDigitMonth = (d.getMonth()+1).toString().length === 1 ?
  "0" + (d.getMonth()+1).toString() : (d.getMonth()+1).toString();

  var twoDigitDate = d.getDate().toString().length === 1 ?
  "0" + d.getDate().toString() : d.getDate().toString();

  return d.getFullYear().toString() + twoDigitMonth + twoDigitDate;
}

function reverseGeocoding(url) {
  $.getJSON(url, function(data) {
    console.log(data.results[0].geometry.location);
    return data.results[0].geometry.location;
  }).fail(function(){
    console.log('Geocode API Could Not Be Loaded.');
  });
}

function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  var city = {lat: 35.689488, lng: 139.691706};

  // Set map to the city inputted by user.
  map = new google.maps.Map(document.getElementById('map'), {
    center: city,
    zoom: 12,
    mapTypeId: 'roadmap'
  });
}

function drop() {
  clearMarkers();
  for (var i = 0; i < neighborhoods.length; i++) {
    addMarkerWithTimeout(neighborhoods[i], i * 200);
  }
}

function addMarkerWithTimeout(position, timeout) {
  window.setTimeout(function() {
    markers.push(new google.maps.Marker({
      position: position,
      map: map,
      animation: google.maps.Animation.DROP
    }));
  }, timeout);
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

// function toggleBounce(marker) {
//   if (marker.getAnimation() !== null) {
//     marker.setAnimation(null);
//   } else {
//     marker.setAnimation(google.maps.Animation.BOUNCE);
//     setTimeout(function() {
//       marker.setAnimation(null);
//     }, 1500);
//   }
// }