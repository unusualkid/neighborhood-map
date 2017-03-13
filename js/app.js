

/* ======= ViewModel ======= */
function viewModel (){
  var self = this;
  self.city = ko.observable("New York");
  self.broth = ko.observable("Tonkotsu");
  self.locations = ko.observableArray();
  // var fsUrlSearch = "https://api.foursquare.com/v2/venues/explore?";
  // Call Foursquare API to populate our data model
  // fsUrlSearch = "https://api.foursquare.com/v2/venues/explore?";
  // var  fsUrlSearch = "https://api.foursquare.com/v2/venues/explore?";
  // fsUrlSearch += $.param({
  //   'client_id': "ECAQTFZ5BBRCA2SUHXOG1CJDRF442M5N3MKZGC5KAI5GZYPW",
  //   'client_secret': "4V25QGAAULY2DN2CH4KYQELGQ1PXXMNZBOZIQG0FKETPJL1B",
  //   'v': getTodaysDate(),
  //   'near': city,
  //   'limit': 50,

  // });
  // fsUrlSearch = "https://api.foursquare.com/v2/venues/explore?" + $.param({
  //   'client_id': "ECAQTFZ5BBRCA2SUHXOG1CJDRF442M5N3MKZGC5KAI5GZYPW",
  //   'client_secret': "4V25QGAAULY2DN2CH4KYQELGQ1PXXMNZBOZIQG0FKETPJL1B",
  //   'v': getTodaysDate(),
  //   'limit': 50,
  //   'near': city,
  // });

  self.fsUrlSearch = ko.computed(function() {
    return "https://api.foursquare.com/v2/venues/explore?" + $.param({
    'client_id': "ECAQTFZ5BBRCA2SUHXOG1CJDRF442M5N3MKZGC5KAI5GZYPW",
    'client_secret': "4V25QGAAULY2DN2CH4KYQELGQ1PXXMNZBOZIQG0FKETPJL1B",
    'v': getTodaysDate(),
    'limit': 50,
    'near': self.city,
    })
  });
  console.log(self.fsUrlSearch);



  // $.getJSON(fsUrlSearch, function(data) {
  //   console.log(data);
  //   for (i = 0 ; i < data.response.venues.length; i++) {
  //     self.locations.push(data.response.venues[i]);
  //   }
  //   // self.locations = data.response.venues;
  //   console.log(self.locations);
  // }).fail(function(){
  //   console.log('Foursquare API Could Not Be Loaded.');
  // });
};

ko.applyBindings(new viewModel());





// Return today's date in "YYYYMMDD" format for Foursquare API
function getTodaysDate() {
  var d = new Date();
  var twoDigitMonth = (d.getMonth()+1).toString().length === 1 ?
    "0" + (d.getMonth()+1).toString() : (d.getMonth()+1).toString();
  var twoDigitDate = d.getDate().toString().length === 1 ?
    "0" + d.getDate().toString() : d.getDate().toString();
  return d.getFullYear().toString() + twoDigitMonth + twoDigitDate;
}

