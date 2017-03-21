// Foursquare API keys
var CLIENT_ID = "ECAQTFZ5BBRCA2SUHXOG1CJDRF442M5N3MKZGC5KAI5GZYPW";
var CLIENT_SECRET = "4V25QGAAULY2DN2CH4KYQELGQ1PXXMNZBOZIQG0FKETPJL1B";

// Google API key
var KEY = "AIzaSyCNn3TmhHr2huAKuYWaKmvWEkv3qYyvkeA";

var vm = new viewModel();
var markers = [], locs = [], infoWindows = [];
var  loc;

// Google Map variables
var map;
var center = {
  lat: 35.689488,
  lng: 139.691706
};
var markerBounds;


/* ======= ViewModel ======= */
function viewModel (){
  var self = this;
  self.city = ko.observable("Tokyo");
  self.broth = ko.observable("Tonkotsu");
  self.locs = ko.observableArray([]);

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
  console.log(self.fsExploreUrl());
  self.initData = ko.computed(function() {
    initData(self.fsExploreUrl());
  })

  self.modifyMap = ko.computed(function() {
    modifyMap(self.geocodeUrl());
  });

};

ko.applyBindings(vm);


// Populate data with Foursquare database
function initData(url) {

  clearMarkers(markers);
  loc = null;
  infoWindow = null;

  $.getJSON(url, function(data) {

    // For Google Map dynamic zoom later
    markerBounds = new google.maps.LatLngBounds();

    for (i = 0 ; i < data.response.groups[0].items.length; i++) {
      loc = data.response.groups[0].items[i];
      locs.push(loc);
      // console.log(data.response.groups[0].items[i]);

      // Declare latLng for Google Map boundary
      var latLng = new google.maps.LatLng(loc.venue.location.lat, loc.venue.location.lng);

      // Dynamic zoom to show all the markers
      markerBounds.extend(latLng);
      map.fitBounds(markerBounds);

      // setInfowindow(loc);

    }
    // addListenerToMarker();
              console.log("I'm here!");
          // Call function with a timeout so markers drop one after another

      setMarkers(locs);
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
  // function placeMarker(lat,lng) {
  //   // var latLng = new google.maps.LatLng( loc[1], loc[2]);
  //   var marker = new google.maps.Marker({
  //     position : position,
  //     map      : map
  //   });
  //   google.maps.event.addListener(marker, 'click', function(){
  //       infowindow.close(); // Close previously opened infowindow
  //       infowindow.setContent( "<div id='infowindow'>"+ loc[0] +"</div>");
  //       infowindow.open(map, marker);
  //     });
  //   for(var i=0; i<locs.length; i++) {
  //     placeMarker(locs[i].location.lat,locs[i].location.lng);
  //     console.log(locs[i].location.lat);
  //   }
  // }
}
function setMarkers(locs){
  for(var i = 0; i < locs.length; i++){
    // console.log("setMarkers for loop");
    console.log("locs[i].name: "+locs[i].name);
    console.log("locs[i].location.lat, locs[i].location.lat:"+locs[i].venue.location.lat+" "+ locs[i].venue.location.lat);
    // var marker = locs[i];
    var latLng = new google.maps.LatLng(locs[i].venue.location.lat, locs[i].venue.location.lng);
    var content = createContent(locs[i]);
    var infowindow = new google.maps.InfoWindow();
    // var infowindow = setInfowindow(locs[i]);

    var marker = new google.maps.Marker({
      position: latLng,
      map: map,
      animation: google.maps.Animation.DROP
    });

    // marker.addListener('click', function(){
    //     infowindow.open(map, marker);
    // });

    google.maps.event.addListener(marker, 'click', function(content){
      return function(){
        infowindow.setContent(content);
        infowindow.open(map, this);
      }
    }(content));
  }
}

// function setMarkers(position, timeout) {
//   window.setTimeout(function() {
//     marker = new google.maps.Marker({
//       position: position,
//       map: map,
//       animation: google.maps.Animation.DROP
//     });
//     console.log("addMarkerWithTimeout.marker: "+marker.position);
//     // addListener(marker);
//     // addListener();
//     markers.push(marker);
//   }, timeout);
// }

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


function createContent(loc) {

  var contentString ='<div id="content">'+
  '<img id="site-img" class="img-thumbnail img-responsive pull-right" src="'+ loc.tips[0].photourl +'" alt="pic">'+
  '<h4 id="first-heading" class="first-heading">'+ loc.venue.name + '</h4>'+
  '<div id="rating">Rating: ' +
  '<span id="rating-content" style="color: #'+loc.venue.ratingColor + '">'+
  loc.venue.rating + '</span>' +
  '</div>' +
  '<div id="body-content">'+
  '<div id="address">Address: '+
  '<span id="address-content">' +loc.venue.location.formattedAddress + '</span>'+
  '</div>'+
  '<div id="phone">Phone: '+
  '<span id="phone-content">' +loc.venue.contact.formattedPhone + '</span>'+
  '</div>'+
  '</div>'+
  '</div>';

  return contentString;
}


function clearMarkers(markers) {
  if (markers) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];
  }
}


// function addListener(marker) {
//   console.log("addListener.marker");
//   console.log(marker.position);
//   marker.addListener('click', function() {
//     console.log('marker.addListener("click", function()');
//     console.log(marker.position.lat());
//     infoWindows.open(map, marker);
//   })
// }


function addListenerToMarker() {
  console.log("addListenerToMarker.markers.length: "+markers.length);
  for(var i; i < markers.length ; i++){
    console.log("markers[i]: "+ markers[i].position);
    console.log("infoWindows[i]: "+infoWindows[i]);
    markers[i].addListener('click', function(){
      infoWindows[i].open(map, markers[i]);
      console.log("addListenerToMarker marker: "+ markers[i].position);
      toggleBounce(markers[i]);
    });
  }

}


function toggleBounce(marker) {
  console.log("toggleBounce location: "+ loc.name);
  console.log("toggleBounce marker: "+ marker.position);
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}
