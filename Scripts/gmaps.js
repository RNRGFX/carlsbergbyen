function initialize() {
	
	/* MAP OVERLAY 	--------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
	// Bounds: left bottom (y, x), right top (y, x)
	var imageBounds = new google.maps.LatLngBounds(new google.maps.LatLng(55.661595,12.524802), new google.maps.LatLng(55.671255,12.541922));
	var mapBounds = new google.maps.LatLngBounds(new google.maps.LatLng(55.66355729553463,12.52953449465947), new google.maps.LatLng(55.6699282416462 ,12.537376685211228 ));
	// create overlay
	var overlay = new google.maps.GroundOverlay('/img/map.png', imageBounds);
		
	try{
		var myLatlng = new google.maps.LatLng(lat, lng);

		
		var mapOptions = {
		  center: myLatlng,
		  zoom: 16,
		  maxZoom: 16,
		  minZoom: 16,
		  disableDoubleClickZoom: false,
		  disableDefaultUI: true
		};
		var map = new google.maps.Map(document.getElementById("map-canvas"),
		    mapOptions);
		    
	    var image = '/img/pin.png'; 
		    
		var marker = new google.maps.Marker({
		    position: myLatlng,
		    map: map,
		    icon: image
		}); 
		
		overlay.setMap(map);	
	    
	    var lastValidCenter = map.getCenter();
	
		google.maps.event.addListener(map, 'center_changed', function() {
		    if (mapBounds.contains(map.getCenter())) {
		        // still within valid bounds, so save the last valid position
		        lastValidCenter = map.getCenter();
		        return; 
		    }
		
		    // not valid anymore => return to last valid position
		    map.panTo(lastValidCenter);
		    
		});

	
	} catch (error){}
	
		
	
}
// initialize when loaded
google.maps.event.addDomListener(window, 'load', initialize);