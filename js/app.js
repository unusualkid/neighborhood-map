// Foursquare API keys
var CLIENT_ID = "ECAQTFZ5BBRCA2SUHXOG1CJDRF442M5N3MKZGC5KAI5GZYPW";
var CLIENT_SECRET = "4V25QGAAULY2DN2CH4KYQELGQ1PXXMNZBOZIQG0FKETPJL1B";

// Google API key
var KEY = "AIzaSyCNn3TmhHr2huAKuYWaKmvWEkv3qYyvkeA";

// viewModel variable
var vm = new viewModel();

var markers = [];

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
  console.log(self.locations());
  console.log(self.locations.length);
  console.log(self.locations().length);
  console.log(self.locations()[0]);
  console.log(self.locations[0]);
// console.log(self.locations[0].location.labeledLatLngs);
  for (i = 0; i < self.locations.length ; i++) {
    console.log("i");
    var marker = new google.maps.Marker({
      // position: {self.locations()[i].location.lat, self.locations()[i].location.lng}
      map: map,
      animation: google.maps.Animation.DROP,
    });
    var infowindow = new google.maps.InfoWindow({
      content: 'Do you ever feel like an InfoWindow?'
    });
  }

  // reverseGeocoding(self.geocodeUrl());
};


ko.applyBindings(vm);


// Populate data with Foursquare database
function populateData(url, locations) {
  $.getJSON(url, function(data) {
    // console.log(data);
    for (i = 0 ; i < data.response.groups[0].items.length; i++) {
      locations.push(data.response.groups[0].items[i].venue);
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

var map;

function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  // console.log(vm.city());
  // console.log(vm.geocodeUrl());
  // console.log(reverseGeocoding(vm.geocodeUrl()));
  // var city = reverseGeocoding(vm.geocodeUrl());
  // console.log(city);
  var city = {lat: 35.689488, lng: 139.691706};

  // Set map to the city inputted by user.
  map = new google.maps.Map(document.getElementById('map'), {
    center: city,
    zoom: 12,
    mapTypeId: 'roadmap'
  });

  var tribeca = {lat: 35.689488, lng: 139.691706};


  var marker = new google.maps.Marker({
    position: tribeca,
    map: map,
    animation: google.maps.Animation.DROP,
  });
  var infowindow = new google.maps.InfoWindow({
    content: 'Do you ever feel like an InfoWindow?'
  });
  marker.addListener('click', function(){
    infowindow.open(map, marker);
    toggleBounce(marker=marker);
  })
}

function toggleBounce(marker) {
  console.log("here");
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      marker.setAnimation(null);
    }, 1500);
  }
}