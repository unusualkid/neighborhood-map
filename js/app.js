// Foursquare API keys
var CLIENT_ID = "ECAQTFZ5BBRCA2SUHXOG1CJDRF442M5N3MKZGC5KAI5GZYPW";
var CLIENT_SECRET = "4V25QGAAULY2DN2CH4KYQELGQ1PXXMNZBOZIQG0FKETPJL1B";

// Google API key
var KEY = "AIzaSyCNn3TmhHr2huAKuYWaKmvWEkv3qYyvkeA";

var vm = new viewModel();
var markers = [];
var marker,location;


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

  self.modifyMap = ko.computed(function() {
    modifyMap(self.geocodeUrl());
  });

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
  location = null;

  $.getJSON(url, function(data) {
    // For Google Map dynamic zoom later
    markerBounds = new google.maps.LatLngBounds()

    for (i = 0 ; i < data.response.groups[0].items.length; i++) {
      location = data.response.groups[0].items[i].venue;
      locations.push(location);
      console.log(location);
      // Declare position for google.maps.Marker
      var position = new google.maps.LatLng(location.location.lat,
        location.location.lng);

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
    mapTypeId: 'terrain',
    streetViewControlOptions: {
      position: google.maps.ControlPosition.LEFT_TOP
    },
    mapTypeControlOptions: {
      position: google.maps.ControlPosition.TOP_RIGHT,
    },
    zoomControlOptions: {
      position: google.maps.ControlPosition.LEFT_TOP
    },
    scaleControl: true
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
    center = {
      lat: data.results[0].geometry.location.lat,
      lng: data.results[0].geometry.location.lng
    };

      // Modify the Google Map center
      map.setCenter(center);
    })
  .fail(function(){
    console.log('Google Map API Could Not Be Loaded.');
  });
}

function addMarkerWithTimeout(position, timeout) {
  window.setTimeout(function() {
    marker = new google.maps.Marker({
      position: position,
      map: map,
      animation: google.maps.Animation.DROP
    });
    console.log("location: "+ location);
    var contentString ='<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h1 id="firstHeading" class="firstHeading">'+location.rating+
    '</h1>'+
    '<div id="bodyContent">'+
    '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
    'sandstone rock formation in the southern part of the '+
    'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
    'south west of the nearest large town, Alice Springs; 450&#160;km '+
    '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
    'features of the Uluru - Kata Tjuta National Park. Uluru is '+
    'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
    'Aboriginal people of the area. It has many springs, waterholes, '+
    'rock caves and ancient paintings. Uluru is listed as a World '+
    'Heritage Site.</p>'+
    '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
    'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
    '(last visited June 22, 2009).</p>'+
    '</div>'+
    '</div>';

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });
    marker.addListener('click', function(){
      infowindow.open(map, marker);
      toggleBounce(marker=marker);
    })

    markers.push(marker);

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

function toggleBounce(marker) {
  console.log("here");
  console.log("location: "+ location);
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}
