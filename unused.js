var map;

function initMap(city) {

    var infowindow = new google.maps.InfoWindow({
      content: 'Do you ever feel like an InfoWindow?'
    });
    marker.addListener('click', function(){
      infowindow.open(map, marker);
      toggleBounce(marker=marker);
    })
  }



      // console.log("marker: "+ marker.position);
    marker.addListener('click', function(){
      // infowindow.open(map, marker);
      console.log("marker: "+ marker.position);
      toggleBounce(marker);
    })
