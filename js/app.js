    var map;

    var parent = this;
    function initMap() {
        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 40.7413549, lng: -73.9980244},
          zoom: 13,
          mapTypeId: 'roadmap'
        });
        var tribeca = {lat: 40.7413549, lng: -73.9980244};
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