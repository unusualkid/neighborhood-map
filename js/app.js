/* ======= ViewModel ======= */
function viewModel (){
  var self = this;
  self.city = ko.observable("Tokyo");
  self.broth = ko.observable("Tonkotsu");
  self.locations = ko.observableArray();
  self.query = ko.computed(function() {
    return 'Ramen' + " " + self.broth().toString();
  });

  self.geocodeUrl = ko.computed(function() {
    return "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCNn3TmhHr2huAKuYWaKmvWEkv3qYyvkeA&"
    + $.param({
      'address': self.city
    })
  });

  // Create Foursquare API to populate our data
  self.fsExploreUrl = ko.computed(function() {
    return "https://api.foursquare.com/v2/venues/explore?" + $.param({
      'client_id': "ECAQTFZ5BBRCA2SUHXOG1CJDRF442M5N3MKZGC5KAI5GZYPW",
      'client_secret': "4V25QGAAULY2DN2CH4KYQELGQ1PXXMNZBOZIQG0FKETPJL1B",
      'v': getTodaysDate(),
      'limit': 10,
      'near': self.city,
      'query': self.query()
    });
  });

  populateData(self.fsExploreUrl(), self.locations);
  // reverseGeocoding(self.geocodeUrl());
};

vm = new viewModel();

ko.applyBindings(vm);


// Populate data with Foursquare database
function populateData(url, locations) {
  $.getJSON(url, function(data) {
    // console.log(data);
    for (i = 0 ; i < data.response.groups[0].items.length; i++) {
      locations.push(data.response.groups[0].items[i]);
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
    }
}