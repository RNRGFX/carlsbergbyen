$(document).ready(function(){

	var $container = $('#listings');
	
	$container.imagesLoaded( function() {
		$container.isotope({
			resizeable: true,
			layoutMode: 'fitRows',
			masonry: {
		    	columnWidth: ($container.width()-90) / 3,
		    	gutterWidth: 40
			},
			getSortData : {
	          area : function( $elem ) {
	            return parseInt($elem.attr('data-area'));
	          },
	          property : function( $elem ) {
	            return $elem.attr('data-property');
	          },
	          status : function( $elem ) {
	            return $elem.attr('data-status');
	          }
	        },
	        onLayout: function( $elems, instance ) {
			    $elems.css({ opacity: 1 });
			  }
		});
		
		$('.imgwrapper img').each(function(){
			$(this).css('margin-top',-1*($(this).height()-184)/2);
		})		
		
		$('.isotope-item').each(function(){
			$(this).css('opacity',1);
		})		

		
	});
	
	$('.sorter').click(function(){
		$container.isotope({
			sortBy: $(this).attr('rel'),
			sortAscending : eval($(this).attr('data-asc'))
		});
		
		var order = ($(this).attr('data-asc') == 'true') ? 'false' : 'true';
		$(this).attr('data-asc', order);
	})

	
	
})