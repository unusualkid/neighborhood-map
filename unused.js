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
