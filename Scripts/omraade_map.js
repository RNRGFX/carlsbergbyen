var lat = 55.666095;
var lng = 12.534922;

$(document).ready(function(){
	$('body, html').delay(500).animate({scrollTop: 114});

	
	$('#searchbox .inner').click(function(){
		$(this).find('.hidden').removeClass('hidden');
		$(this).find('.text').addClass('hidden');
		$(this).addClass('gu2').removeClass('gu1');
		$(this).find('input.search').focus();
		return false;
	})
	
	$('#searchbox .closer').click(function(){
		clearFiltering();
		return false;
	})
	
	hideSearcher = function(){
		$('#searchbox .inner .main').addClass('hidden');
		$('#searchbox .text').removeClass('hidden');
		$('#searchbox .inner').removeClass('gu2').addClass('gu1');
	}
	
	// clear filtering
	$(document).keyup(function(e) {
	  if (e.keyCode == 27) {
	  	if($('input#eventsearch').val() != ''){
		  	clearFiltering()
		} else {
			hideSearcher(); // hide searchbox again
		}
	  }   // esc
	});
	
	function clearFiltering(){
		$('#entries .col.gu2').show().removeHighlight()
		
		
		if($('input#eventsearch').val() != ''){
			 $('input#eventsearch').val('');
		} else {
			hideSearcher(); // hide searchbox again
		}		
	}
	
	$('input#eventsearch').on('paste input', function(){ 
		var search = $(this).val();
		
		$('#entries .col.gu2').removeHighlight()
		$('#entries .col.gu2:not(:icontains("'+search+'"))').hide();
		$('#entries .col.gu2:icontains("'+search+'")').show().highlight(search);		
		
	}); 
	
});



function initialize() {
	
	/* MAP OVERLAY 	--------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
	// Bounds: left bottom (y, x), right top (y, x)
	var imageBounds = new google.maps.LatLngBounds(new google.maps.LatLng(55.658560,12.519410), new google.maps.LatLng(55.67491,12.548418));
	var mapBounds = new google.maps.LatLngBounds(new google.maps.LatLng(55.66295729553463,12.52833449465947), new google.maps.LatLng(55.6699282416462 ,12.538376685211228 ));
	// create overlay
	var overlay = new google.maps.GroundOverlay('/img/bigmap-2.png', imageBounds, map);
	var myLatlng = new google.maps.LatLng(lat, lng);	
	
			
	var mapOptions = {
	  center: myLatlng,
	  zoom: 17,
	  maxZoom: 17,
	  minZoom: 17,
	  disableDoubleClickZoom: false,
	  disableDefaultUI: true,
	  scrollwheel: false,
	};
	var map = new google.maps.Map(document.getElementById("map-canvas"),
	    mapOptions);
	
	var rectangleLeft = new google.maps.Rectangle({
	    strokeColor: '#FF0000',
	    strokeOpacity: 0,
	    strokeWeight: 0,
	    fillColor: '#2b2f36',
	    fillOpacity: 1,
	    map: map,
	    bounds: new google.maps.LatLngBounds(
	      new google.maps.LatLng(55.658560, 11.519410),
	      new google.maps.LatLng(55.67491,12.519410))
	  });
	  
	 var rectangleRight = new google.maps.Rectangle({
	    strokeColor: '#FF0000',
	    strokeOpacity: 0,
	    strokeWeight: 0,
	    fillColor: '#2b2f36',
	    fillOpacity: 1,
	    map: map,
	    bounds: new google.maps.LatLngBounds(
	      new google.maps.LatLng(55.658560, 12.548418),
	      new google.maps.LatLng(55.67491,13.548418))
	  }); 
	
	// add mapoverlay:
	overlay.setMap(map);
	//overlay.setOpacity(0.7);

	
	//restrict within bounds:	
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
	
	google.maps.event.addListener(overlay, 'click', function(event) {
		$('#whitebox .closer').trigger('click');
    });
	
		
		/* ADD DATA TO PROPERTIES 		---------------------------------------------------------------------------------------------------------------------------------------------------------- */
	var url = '/datakilder/building-areas-feed/'
	areas = {};
	
	
	$.getJSON( url, function( JSONdata ) {
					
		for (var property in JSONdata) {
			var curPaths = eval(JSONdata[property].coords);
			areas[JSONdata[property].name] = new google.maps.Polygon({
				paths: curPaths,
				strokeColor: '#000000',
				strokeOpacity: 0,
				strokeWeight: 0,
				fillColor: '#b01d34',
				fillOpacity: 0,
				name: JSONdata[property].name,
				url:JSONdata[property].url,
				description:  JSONdata[property].description,
				thumbnail:  JSONdata[property].thumbnail,
				parent:  JSONdata[property].parent			
			});
			
			areas[JSONdata[property].name].setMap(map);
			
			google.maps.event.addListener(areas[JSONdata[property].name], 'click', function(event) {
				showInfoBox(this)
				
		    });
		    
		    google.maps.event.addListener(areas[JSONdata[property].name],"mouseover",function(){
			 	this.setOptions({fillOpacity: 1});
			}); 
			
			google.maps.event.addListener(areas[JSONdata[property].name],"mouseout",function(){
			 	this.setOptions({fillOpacity: 0});
			});
			
		}
		
	}); // end getJSON
	
	 var mouse_position_x,
		mouse_position_y
    
    $( window ).on( "mousemove", function( event ) {
	  mouse_position_x =  event.pageX;
	  mouse_position_y = event.pageY;
	});
    
	
	
	
	
	
	function showInfoBox(prop){
		
			
		var htmlString = '<a class="closer"></a>',
			leftPosSpan = $(window).width()/3,
			topPosSpan = $( "#mapwrapper" ).height()/2+350,
			topPos = mouse_position_y- $(window).scrollTop()
		
		
		$('#whitebox').attr('class','')
			
		if (mouse_position_x < leftPosSpan){			
			$('#whitebox').addClass('left');
		} else if(mouse_position_x > leftPosSpan && mouse_position_x < (leftPosSpan*2)) {			
			$('#whitebox').addClass('center');
		} else if(mouse_position_x > (leftPosSpan*2) && mouse_position_x < (leftPosSpan*3)) {			
			$('#whitebox').addClass('right');
		}
		
		if (topPos > topPosSpan){
			$('#whitebox').addClass('top');
		} else {
			$('#whitebox').addClass('bottom');
			
		}
		
			
		htmlString += '<h2>'+prop.name+'</h2>';
		htmlString += '<div class="meta">'+prop.parent+'</div>';
		htmlString += '<img src="'+prop.thumbnail+'" />';
		if (prop.description != null) htmlString += '<div class="desc">'+prop.description+'</div>';
		htmlString += '<a class="readmore" href="'+prop.url+'">Se mere om bygningen</a>';
		$('#whitebox .inner').html(htmlString);
		$('#whitebox').css({'display':'block', 'opacity': 1,'left':mouse_position_x,'top':mouse_position_y});

		$('#whitebox .closer').click(function(e){
			
			$('#whitebox').css('opacity', 0)
			setTimeout(function(){$('#whitebox').hide()}, 200);
			return false;
		})
		
		$(document).keyup(function(e) {
			if (e.keyCode == 27) {
			  	$('#whitebox .closer').trigger('click');
			}   // esc
		})		
		
	}
	
	$('#content').click(function(){
		$('#whitebox .closer').trigger('click');
		
	});
	
	
}
// initialize when loaded
google.maps.event.addDomListener(window, 'load', initialize);

