// Foursquare API keys
var CLIENT_ID = "ECAQTFZ5BBRCA2SUHXOG1CJDRF442M5N3MKZGC5KAI5GZYPW";
var CLIENT_SECRET = "4V25QGAAULY2DN2CH4KYQELGQ1PXXMNZBOZIQG0FKETPJL1B";

// Google API key
var KEY = "AIzaSyCNn3TmhHr2huAKuYWaKmvWEkv3qYyvkeA";

// viewModel variable
var vm = new viewModel();

var markers = [];

var map;

var firstLoad = true;

var center = {
  lat: 35.689488,
  lng: 139.691706
};

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

  self.modifyCenter = ko.computed(function() {
    modifyCenter(self.geocodeUrl());
  });

// console.log(self.center());

  // console.log(self.center());
  self.ConsoleLog1 = ko.computed(function() {
    console.log("geocodeUrl(): " + self.geocodeUrl());
  });
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


  // Create Foursquare API to populate our data
  self.fsExploreUrl = ko.computed(function() {
    return "https://api.foursquare.com/v2/venues/explore?" + $.param({
      'client_id': CLIENT_ID,
      'client_secret': CLIENT_SECRET,
      'v': getTodaysDate(),
      'limit': 5,
      'near': self.city,
      'query': self.query()
    });
    console.log("self.fsExploreUrl");
  });

  self.search = ko.computed(function() {
    populateData(self.fsExploreUrl(), self.locations);
  })


};


ko.applyBindings(vm);


// Populate data with Foursquare database
function populateData(url, locations) {
  // console.log("populateData" + url);

  clearMarkers();
  // firstLoad = false;
  $.getJSON(url, function(data) {
    // console.log(".getJSONFoursquare");
    for (i = 0 ; i < data.response.groups[0].items.length; i++) {
      locations.push(data.response.groups[0].items[i].venue);

        // Declare position for google.maps.Marker
        var position = {lat: locations()[locations().length-1].location.lat,
          lng: locations()[locations().length-1].location.lng};

        // Call function with a timeout so markers drop one after another
        addMarkerWithTimeout(position, i * 200);
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

// function reverseGeocoding(url) {
//   $.getJSON(url, function(data) {
//     console.log(data.results[0].geometry.location);
//     return data.results[0].geometry.location;
//   }).fail(function(){
//     console.log('Geocode API Could Not Be Loaded.');
//   });
// }

function modifyCenter(url) {
  $.getJSON(url, function(data) {
      console.log(data.results[0].geometry.location);
      center = {
        lat: data.results[0].geometry.location.lat,
        lng: data.results[0].geometry.location.lng
      };
      console.log(center);

      // Modify the google map center
      map.setCenter(center);
    })
  .fail(function(){
    console.log('Geocode API Could Not Be Loaded.');
  });
}

// function initMap(center) {
//   map.center = {
//     lat: 35.689488,
//     lng: 139.691706
//   }
//   // initMap();
// }


function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: center,
    zoom: 12,
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