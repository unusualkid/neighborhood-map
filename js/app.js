// Foursquare API keys
var CLIENT_ID = "ECAQTFZ5BBRCA2SUHXOG1CJDRF442M5N3MKZGC5KAI5GZYPW";
var CLIENT_SECRET = "4V25QGAAULY2DN2CH4KYQELGQ1PXXMNZBOZIQG0FKETPJL1B";

// Google API key
var KEY = "AIzaSyCNn3TmhHr2huAKuYWaKmvWEkv3qYyvkeA";

var vm = new viewModel();
var markers = [];

// Google Map variables
var map;
var center = {
  lat: 35.689488,
  lng: 139.691706
};
var markerBounds;

/* ======= Model ======= */
var locations = [];

/* ======= ViewModel ======= */
function viewModel (){
  var self = this;
  self.city = ko.observable("Tokyo");
  self.broth = ko.observable("Tonkotsu");
  self.locations = ko.observableArray([]);

  // Foursquare API parameter
  self.query = ko.computed(function() {
    return 'Ramen' + " " + self.broth().toString();
  });

  // Create the Google Map geocode API dynacically based on user's input of city
  self.geocodeUrl = ko.computed(function() {
    return "https://maps.googleapis.com/maps/api/geocode/json?"
    + $.param({
      'key': KEY,
      'address': self.city
    })
  });

  self.modifyMap = ko.computed(function() {
    modifyMap(self.geocodeUrl());
  });

  // Create Foursquare API to populate our data
  self.fsExploreUrl = ko.computed(function() {
    return "https://api.foursquare.com/v2/venues/explore?"
    + $.param({
      'client_id': CLIENT_ID,
      'client_secret': CLIENT_SECRET,
      'v': getTodaysDate(),
      'limit': 10,
      'near': self.city,
      'query': self.query()
    });
  });

  self.initData = ko.computed(function() {
    initData(self.fsExploreUrl());
  })

  // self.ConsoleLog1 = ko.computed(function() {
  //   console.log("geocodeUrl(): " + self.geocodeUrl());
  // });
    // self.ConsoleLog2 = ko.computed(function() {
    //   console.log("locations(): " + self.locations());
    // });
    // self.ConsoleLog3 = ko.computed(function() {
    //   console.log("center(): " + self.center());
    // });
    // self.ConsoleLog4 = ko.computed(function() {
    //   console.log("city(): " + self.city());
    // });
    // self.ConsoleLog5 = ko.computed(function() {
    //   console.log("center(): " + self.center());
    // });
};


ko.applyBindings(vm);


// Populate data with Foursquare database
function initData(url) {
  clearMarkers();
  locations = [];

  $.getJSON(url, function(data) {
    // For Google Map dynamic zoom later
    markerBounds = new google.maps.LatLngBounds()

    for (i = 0 ; i < data.response.groups[0].items.length; i++) {
      locations.push(data.response.groups[0].items[i].venue);

      // Declare position for google.maps.Marker
      var position = new google.maps.LatLng(locations[locations.length-1].location.lat,
        locations[locations.length-1].location.lng);

      // Dynamic zoom to show all the markers
      markerBounds.extend(position);
      map.fitBounds(markerBounds);

      // Call function with a timeout so markers drop one after another
      addMarkerWithTimeout(position, i * 200);

    }
    console.log("markers: "+ markers.length);
    console.log("locations: "+locations);
  }).fail(function(){
      console.log('Foursquare API Could Not Be Loaded.');
    });

}

// Initialize Google Map
function initMap() {
  markerBounds = new google.maps.LatLngBounds();
  map = new google.maps.Map(document.getElementById('map'), {
    center: center,
    zoom: 14,
    mapTypeId: 'roadmap',
    streetViewControlOptions: {
      position: google.maps.ControlPosition.LEFT_TOP
    },
    mapTypeControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER
    },
    zoomControlOptions: {
      position: google.maps.ControlPosition.LEFT_TOP
    },
  });
}

// Return today's date in "YYYYMMDD" format
function getTodaysDate() {
  var d = new Date();

  var twoDigitMonth = (d.getMonth()+1).toString().length === 1 ?
  "0" + (d.getMonth()+1).toString() : (d.getMonth()+1).toString();

  var twoDigitDate = d.getDate().toString().length === 1 ?
  "0" + d.getDate().toString() : d.getDate().toString();

  return d.getFullYear().toString() + twoDigitMonth + twoDigitDate;
}

function modifyMap(url) {
  $.getJSON(url, function(data) {
    center = new google.maps.LatLng(data.results[0].geometry.location.lat,
      data.results[0].geometry.location.lng);

      // Modify the Google Map center
      map.setCenter(center);
    })
  .fail(function(){
    console.log('Google Map API Could Not Be Loaded.');
  });
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
  if (markers) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];
  }
}

