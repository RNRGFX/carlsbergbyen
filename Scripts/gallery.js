$(document).ready(function(){


	

	var $container = $('#galleries');
	
	$container.imagesLoaded( function() {
		$container.isotope({
			resizeable: true,
			layoutMode: 'fitRows',
			transitionDuration: 0.1,
			masonry: {
		    	columnWidth: ($container.width()-90) / 3,
		    	gutter: 10
			},
			getSortData : {
	          date : function( elem ) {
	            return parseInt($(elem).attr('data-date'));
	          },
	          name : function( elem ) {
	            return $(elem).attr('data-name').replace(/\s+/g, ' ');
	          },
	          copyright : function( elem ) {
	            return $(elem).attr('data-copyright');
	          }
	        }
		});
		
		$('.imgwrapper').each(function(){
			$(this).css({'opacity':1}).find('img').css({'min-width': $('.galleryItem').width()})
		})		
		
		
		
	});
	
	$('.sorter').click(function(){
	
		$sorter = $(this);
		$container.isotope({
			sortBy: $sorter.attr('rel'),
			sortAscending : eval($sorter.attr('data-asc')),
			transitionDuration: 0.1
		});
		
		$('.galleryItem .data').each(function(e){
			$(this).removeClass('active').parent().find('#'+$sorter.attr('rel')).addClass('active');
		})
		
		var order = ($(this).attr('data-asc') == 'true') ? 'false' : 'true';
		$(this).attr('data-asc', order);
	})

	


	$('a.fancybox').fancybox({
		afterLoad: function() {
			var highres = (Number($(this.element).attr('data-width')) > 1000) ? 'Ja' : 'Nej';
	        this.title = '<div class="data" id="info"><div class="meta"><span class="label">Billedinformation: <span class="hilight">'+$(this.element).attr('data-count')+'</span></span></div>'
	        if ($(this.element).attr('data-link-to') == "" && $(this.element).attr('data-desc') != ""){
				this.title +=  '<span class="content">'+$(this.element).attr('data-desc')+'</span></div>'	
	        } else {
	        	this.title += '<a class="linkto" href="'+$(this.element).attr('data-link-to')+'">'+$(this.element).attr('data-link-to-name')+'</a></div>';
	        }
	        this.title += '<div class="data" id="dato"><div class="meta"><span class="label">Dato: </span></div><span class="content">'+$(this.element).attr('data-date')+'</span></div>';
	        this.title += '<div class="data" id="name"><div class="meta"><span class="label">Filnavn: </span></div><span class="content">'+$(this.element).attr('data-name')+'</span></div>';
	        
	        if($(this.element).attr('data-copyright') != ""){
	        	this.title += '<div class="data" id="copyright"><div class="meta"><span class="label">Fotograf: </span></div><span class="content">'+$(this.element).attr('data-copyright')+'</span></div>';
	        }
	        
	        
	        if (highres == 'Ja') {
		        this.title += '<div class="data" id="highres"><div class="meta"><span class="label">Highres: </span></div>'
		        this.title +=  '<a class="linkto" href="'+$(this.element).attr('data-imgurl')+'" target="_blank">Åben</a>'
	        } 
	        
	        this.title += '</div>';
	        
	    },
	    helpers : {
	        title: {
	            type: 'inside'
	        }
	    },
	    padding 	: 0
	});
	
	
})