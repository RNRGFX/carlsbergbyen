

$(document).ready(function(){
	var $container = $('.eventcontainer'),	
		state = {};
	
	
	
	// dropdown actions
	$('#eventSorterDropDowns .select .selector').click(function(event){
		$(this).parent().toggleClass('dropped');
		 event.stopPropagation();
		return false;
	})
	
	$('html, #eventSorterDropDowns .select ul.dropdown li a').click(function(){
		$('#eventSorterDropDowns .select').removeClass('dropped');
	});
	
	
	$('.event-overview  #searchbox .inner').click(function(){
		$(this).find('.hidden').removeClass('hidden');
		$(this).find('.text').addClass('hidden');
		$(this).addClass('gu2').removeClass('gu1');
		$(this).find('input.search').focus();
		return false;
	})
	
	$('.event-overview  #searchbox .closer').click(function(){
		hideSearcher()
		return false;
	})
	
	hideSearcher = function(){
		
		$('.isotope-item').removeHighlight()
	
		if(!$.isEmptyObject($.bbq.getState())){
		  	clearFiltering()
		} else {
			$('.event-overview  #searchbox .inner .main').addClass('hidden');
			$('.event-overview  #searchbox .text').removeClass('hidden');
			$('.event-overview  #searchbox .inner').removeClass('gu2').addClass('gu1');
		}
	
		
	}
	
	// clear filtering
	$(document).keyup(function(e) {
	  if (e.keyCode == 27) {
		hideSearcher();
	  	
	  }   // esc
	});
	
	
	function clearFiltering(){
		state = {};
	  	$.bbq.pushState( state, 2 )
	  	$('input#eventsearch').val('');
	}
	
	// clear select venue
	$('#venues.select .venue').click(function(){
		if($(this).hasClass('active')){
			state['venue'] = {};		
		} else {
			state['venue'] = $(this).attr('id');
		} 		
		$.bbq.pushState(state); 
		return false;
	})
	
	$('.select#venues > .closer').click(function(){
		state['venue'] = {};		
		$.bbq.pushState(state); 
		return false;
	})
	
	// clear select genres
	$('#genres.select .genre').click(function(){
		if($(this).hasClass('active')){
			state['genres'] = {};		
		} else {
			state['genres'] = $(this).attr('id'); 		
		}
		$.bbq.pushState(state); 
		return false;
	})
	
	$('.select#genres > .closer').click(function(){
		state['genres'] = {};		
		$.bbq.pushState(state); 
		return false;
	})
	
	
	// clear select dates
	$('#date.select .fixedperiod').click(function(){
		state['enddate'] = eval($(this).attr('id')); 
		state['startdate'] = currentDate; 
		$.bbq.pushState(state); 
		return false;
	})
	
	$('.select#date > .closer').click(function(){
		state['enddate'] = {};	
		state['startdate'] = {};		
		$.bbq.pushState(state); 
		return false;
	})
	
	// create datepickers
	$('.datepicker').datepicker({
		inline: true,
		dayNamesShort: $.datepicker.regional[ "da" ].dayNamesShort,
	    dayNames: $.datepicker.regional[ "da" ].dayNames,
	    monthNamesShort: $.datepicker.regional[ "da" ].monthNamesShort,
	    monthNames: $.datepicker.regional[ "da" ].monthNames,
		firstDay: 1,
		dateFormat: "d. MM yy",
		altFormat: "yymmdd",
		onSelect: function (dateText, inst) {
			var altFormat = $(this).datepicker('option', 'altFormat');		    
		    var currentDate = $(this).datepicker('getDate');		    
		    var formatedDate = $.datepicker.formatDate(altFormat, currentDate);		    
		    
		    state[inst.id] = formatedDate; 
			$.bbq.pushState(state);
		}  
	}).click(function(){
		event.stopPropagation();	
	})
	

	
	
	$container.imagesLoaded( function() {
		$container.isotope({
			resizeable: true,
			transitionDuration: 0,
			masonry: {
		    	columnWidth: ($container.width()-90) / 3,
		    	gutter: 40
			},
			
			getSortData : {
	          date : function( elem ) {
	            return parseInt($(elem).attr('data-startdate'));
	          },
	          genre : function( elem ) {
	            return $(elem).attr('data-genrer');
	          },
	          venue : function( elem ) {
	            return $(elem).attr('data-venue');
	          },
	          repeatable : function( elem ) {	          	
	            return $(elem).attr('data-repeatable');
	          }
	          
	        }
		});		
		
		$(window).trigger( 'hashchange' );
		$('.isotope-item').each(function(){
			$(this).css('opacity',1);
		})	
	});
	
	$(window).on("debouncedresize", function( event ) {
		$container.isotope({
			masonry: { 
				columnWidth: ($container.width()-90) / 3, 
				gutter: 40 
			}
		})
	});
	
	
	
	// sorting:	
	
	var notOrder = 'true';
	var order = 'true';
	
	$('.sorter').click(function(){
		$this = $(this);
		
		
		order = ($(this).attr('data-asc') == 'true') ? 'false' : 'true';
		
		$(this).attr('data-asc', order);
		
		if (order != notOrder){
			$('.isotope-item').each(function(){
				var repeateable = ($(this).attr('data-repeatable') == 1) ? 0 : 1;
				$(this).attr('data-repeatable', repeateable);	
			})
			 notOrder = order;
		 }
		
		
	
		
		$container.isotope('updateSortData').isotope({			
	        sortBy: ['repeatable',  $this.attr('rel')],
			sortAscending : eval($this.attr('data-asc'))
		});
		
		
		
	})
	
	
	
	
	$('input#eventsearch').on('paste input', function(){ 
		state['search'] = $(this).val();
		$.bbq.pushState(state);
	}); 				
    
	$(window).bind( 'hashchange', function(e) {
  		// overall filter containing array
	  	var filterObject = {};
	  
		
		var venues = $.bbq.getState( 'venue', true ) || false;
		var startdate = $.bbq.getState( 'startdate', true ) || false;
		var enddate = $.bbq.getState( 'enddate', true ) || false;
		var genres = $.bbq.getState( 'genres', true ) || false;
		var search = $.bbq.getState( 'search', true ) || false;
		
		
		$('.select ul li a').removeClass('active');
		
		// create search filter	
		if(search){	
			filterObject['search'] = {}
			filterObject['search'][0] = ':icontains("'+search+'")'; 
					
			$('.isotope-item').removeHighlight()
			$('.isotope-item').highlight(search);
		} else {
			$('.isotope-item').removeHighlight()
		}
		
		// create venue object		
		if(venues){	
		
			$('#venues.select .selector').text($('#eventSorterDropDowns .select ul.dropdown li #'+venues).text()).parent().addClass('showcloser');
		
			filterObject['venues'] = {}; 
			var venueArray = venues.split(',');
			
			for (index in venueArray){
			  	filterObject['venues'][index] = '[data-venue*="'+venueArray[index]+'"]';
			  	$('#venues.select #'+venueArray[index]).addClass('active');
			}		
		} else {
			$('#venues.select .selector').text('Vælg venue:').parent().removeClass('showcloser');
		}
		
		// create genre object	
		if(genres){
		
			$('#genres.select .selector').text($('#eventSorterDropDowns .select ul.dropdown li #'+genres).text()).parent().addClass('showcloser');
			
			filterObject['genres'] = {}; 
			var genreArray = genres.split(',');
			
			
			
			for (index in genreArray){
				console.log(genreArray[index])
			
			  	filterObject['genres'][index] = '[data-genrer*="'+genreArray[index]+'"]';
			  	$('#genres.select #'+genreArray[index]).addClass('active');
			}		
		}else {
			$('#genres.select .selector').text('Vælg genre:').parent().removeClass('showcloser');
		}
		
		// update datepicker from selected time
		if (startdate) {
			startdate = startdate.toString();
			var year =  startdate.substr(0,4);
			var month = Number(startdate.substr(4, 2))-1;
			var day = startdate.substr(6,2);
			$('#startdate').datepicker("setDate", new Date(year, month, day));
		} else {
			$('#startdate').datepicker("setDate", null);
		}
		if (enddate) {
			enddate = enddate.toString();
			var year =  enddate.substr(0,4);
			var month = Number(enddate.substr(4, 2))-1;
			var day = enddate.substr(6,2); 
			$('#enddate').datepicker("setDate", new Date(year, month, day));
		} else {
			$('#enddate').datepicker("setDate", null);
		}
		
		// create start & end date object
		if (startdate || enddate) {
			filterObject['dates'] = {};
		} else {
			$('#date.select .selector').text('Vælg periode:').parent().removeClass('showcloser');
		}
		
		// choose according to start/enddate
		if(startdate && !enddate){
			$('#date.select .selector').text('Fra '+$('.datepickers #startdate').val()).parent().addClass('showcloser');		
			$('.isotope-item').each(function(index){
				if(startdate <= $(this).attr('data-enddate')) {				
					filterObject['dates'][index] = '#'+$(this).attr('id');
				}
			})
			
		}
		
		if(!startdate && enddate){
			$('#date.select .selector').text('Til '+$('.datepickers #enddate').val()).parent().addClass('showcloser');			
			$('.isotope-item').each(function(index){
				if(enddate >= $(this).attr('data-startdate')) {				
					filterObject['dates'][index] = '#'+$(this).attr('id');
				}
			})
		}
		
		if(startdate && enddate){
			$('#date.select .selector').text($('.datepickers #startdate').val() +' - '+$('.datepickers #enddate').val()).parent().addClass('showcloser');		
			$('.isotope-item').each(function(index){
				if(enddate >= $(this).attr('data-startdate') && startdate <= $(this).attr('data-enddate')) {				
					filterObject['dates'][index] = '#'+$(this).attr('id');
				}
			})
		}
		
		if((startdate == enddate) && (startdate || enddate)){
			$('#date.select .selector').text($('.datepickers #startdate').val()).parent().addClass('showcloser');	
		}
		
		
		
		
		function filterEvents(){
		
			var filterString = "$('.eventcontainer .isotope-item')";
			var first = true;
			
			for(index in filterObject){
				
				filterArray = [];
				
				for(item in filterObject[index]){
					filterArray.push(filterObject[index][item]);
				}
				
				filterString += ".filter('"+filterArray.toString()+"')";
				
				
			}
			return filterString;
			
		}
			
		
		$('.eventcontainer').isotope({filter: eval(filterEvents()) });
		$('.isotope-item').each(function(){
			$(this).css('opacity',1);
		})
    
   
  })
  
  
  	
	
	
	
			
});