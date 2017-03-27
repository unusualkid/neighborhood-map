var vm = new viewModel();

// Google Map variables
var map;
var center = {
  lat: 35.689488,
  lng: 139.691706
};


// Create the Google Map geocode API dynacically based on user's input of city
var geocodeUrl = ko.computed(function() {
  return "https://maps.googleapis.com/maps/api/geocode/json?"
  + $.param({
    'key': "AIzaSyCNn3TmhHr2huAKuYWaKmvWEkv3qYyvkeA",
    'address': vm.city()
  })
});


  // Create Foursquare API to populate our data
var fsUrl = ko.computed(function() {
    return "https://api.foursquare.com/v2/venues/explore?"
    + $.param({
      'client_id': "ECAQTFZ5BBRCA2SUHXOG1CJDRF442M5N3MKZGC5KAI5GZYPW",
      'client_secret': "4V25QGAAULY2DN2CH4KYQELGQ1PXXMNZBOZIQG0FKETPJL1B",
      'v': getTodaysDate(),
      'limit': 15,
      'near': vm.city(),
      'query': vm.query()
    });
  });


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


/* ======= ViewModel ======= */
function viewModel (){
  var self = this;

  self.city = ko.observable("Tokyo");
  self.broth = ko.observable("Shio");

  // Foursquare API parameter
  self.query = ko.computed(function() {
    return 'Ramen' + " " + self.broth().toString();
  });

  self.filter = ko.observable("");
  self.loc = ko.observable();


  self.locs = ko.observableArray();
  self.markers = [];


  self.filteredLocs = ko.computed(function() {
    if(self.filter() === '') {
      for(var i = 0; i < self.locs().length; i++) {
        self.locs()[i].marker.setVisible(true);
      }
      return self.locs(); //initial load when no genre filter is specified
    } else {
      return ko.utils.arrayFilter(self.locs(), function(loc) {
        if (loc.name.toLowerCase().indexOf(self.filter()) !== -1) {
            loc.marker.setVisible(true);
            return loc;
          }
          loc.marker.setVisible(false);
        });
    }
  });

    showInfoWindow = function(clicked) {
      place = self.locs().find(function(loc) {
        if (loc.marker.title === clicked.name)
          return loc.marker;
        });
      if (place !== undefined) {
        google.maps.event.trigger(place.marker, 'click');
      }
    };

};

ko.applyBindings(vm);


/* ======= Model ======= */
// Populate data with Foursquare database
var initData = ko.computed(function() {
  clearMarkers();
  vm.locs.removeAll();

  $.getJSON(fsUrl(), function(data) {
    // For Google Map dynamic zoom later
    var markerBounds = new google.maps.LatLngBounds();
    vm.infoWindow = new google.maps.InfoWindow();
    vm.currentMarker = null;

    for (i = 0 ; i < data.response.groups[0].items.length; i++) {
      vm.loc = data.response.groups[0].items[i].venue;

      // Declare latLng for Google Map boundary
      var latLng = new google.maps.LatLng(vm.loc.location.lat, vm.loc.location.lng);

      setMarker(vm.loc, latLng);

      // Dynamic zoom to show all the markers
      markerBounds.extend(latLng);
      map.fitBounds(markerBounds);

      vm.locs.push(vm.loc);
    }

  }).fail(function(){
    console.log('Foursquare API Could Not Be Loaded.');
    foursquareError();
  });
});


/* ======= Utility Functions ======= */
// Clear all Google Map markers when data is repopulated by Foursquare call
function clearMarkers() {
  for (var i = vm.markers.length - 1; i >= 0 ; i--) {
    vm.markers[i].setMap(null);
    vm.markers.splice(i, 1);
  }
}


// Set markers to show on map
function setMarker(loc, latLng) {
  var marker = new google.maps.Marker({
    position: latLng,
    map: map,
    title: loc.name,
    animation: google.maps.Animation.DROP
  });

  var content = createContent(loc);

  google.maps.event.addListener(marker, 'click', function(content){
    return function(){
      vm.infoWindow.close();

      toggleBounce(marker);
      vm.infoWindow.setContent(content);
      vm.infoWindow.open(map, this);
    }
  }(content));

  loc.marker = marker;
  vm.markers.push(marker);
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


// Create content in the infowindow
function createContent(loc) {

  var contentString ='<div id="infoWindow-content">'+
  '<h4 id="first-heading" class="first-heading">'+ loc.name + '</h4>'+
  '<div id="rating">Rating: ' +
  '<span id="rating-content" style="color: #'+loc.ratingColor + '">'+
  loc.rating + '</span>' +
  '</div>' +
  '<div id="body-content">'+
  '<div id="address">Address: '+
  '<span id="address-content">' +loc.location.formattedAddress + '</span>'+
  '</div>'+
  '<div id="phone">Phone: '+
  '<span id="phone-content">' +loc.contact.formattedPhone + '</span>'+
  '</div>'+
  '</div>'+
  '</div>';

  return contentString;
}


// Animate Google Map marker
function toggleBounce(marker) {
  // Stop the marker from bouncing if another is clicked
  if (vm.currentMarker)
    vm.currentMarker.setAnimation(null);

  vm.currentMarker = marker;

  // Stop the marker from bouncing if clicked twice and vice versa
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}


function gMapError(){
    $('.content').hide();
    $('#gmap-error-content').text("There has been an error with Google Maps API, please check your internet connection.");
    $('#gmap-error').show();

}


function foursquareError(){
  console.log("foursquare-error");
    $('.content').hide();
    $('#foursquare-error-content').text("There has been an error with Foursquare API, please check your internet connection.");
    $('#foursquare-error').show();
}


/* ======= Debugging ======= */
// Debug console.log
var debug = ko.computed(function() {
  // console.log(geocodeUrl());
  // console.log(vm.fsUrl());
});
