var map;

function initMap(city) {
    // Constructor creates a new map - only center and zoom are required.
    var city = ko.observable{
      lat: 35.689488,
      lng: 139.691706
    };

    // Set map to the city inputted by user.
    map = new google.maps.Map(document.getElementById('map'), {
      center: city,
      zoom: 14,
      mapTypeId: 'roadmap'
    });
    var tribeca = {lat: 35.689488,
      lng: 139.691706};
    var marker = new google.maps.Marker({
      position: tribeca,
      map: map,
      title: 'First Marker',
      animation: google.maps.Animation.DROP,
      draggable: true,
      label: '1',
      icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
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
