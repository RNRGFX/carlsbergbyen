


var currentView;

$(document).ready(function(e) {
    if($.cookie('carlsberg-view-choice')){
		switchView($.cookie('carlsberg-view-choice'));
	} else {
		switchView('view1');
	}
	
	$('#newsViewimg').click(function(){
		$('#newsViews').fadeToggle();
		return false;
	});
	$('html').click(function(){
		$('#newsViews').fadeOut();
	});
	$('#newsViews').click(function(event){
		event.stopPropagation();
	});
	
	
});

function switchView(view){
	
	var postCategory = (category != "") ? "&category="+category : "";
	
	$.cookie('carlsberg-view-choice', view, { expires: 300, path: '/' });
	if (currentView != view){
		$("#newswrapper").css('opacity', 0);
		$.ajax({ 
		 type: "GET", // sendes som POST variabel 
		 url:"/datakilder/infinitenewsfeed/?page=1"+postCategory, 
			success:function(data){ 
			$("#newswrapper").empty(); 
			$("#newswrapper").prepend('<div class="row infinite-container">'+data+'</div>');
				$("#newswrapper").css('opacity', 1);
				processView(view); 
			} 
		}); 
		$('#newsViews').fadeOut();
	}
	
	currentView = view;
	
	$('#newsViews a').each(function(){
		$(this).removeClass('active');
	})
	
	$('#newsViews a.'+view).addClass('active');
	
	
	
}


function processView(view){

		if($container)	$container.isotope('destroy');
	
		switch(view){
			case "view1":
			//kode her: få de tre første div.item ind i en wrapper og op i toppen
			
			if($('.infinite-container .item').length > 3){
				
				$('#newswrapper').prepend('<div class="first row"></div><div class="clearfix spacing45"></div>')
				for(var i = 1;i<=3;i++){
					
					var news = $('.infinite-container .item:nth-child('+i+')').contents();
					$('.first.row').append('<div class="item col gu2 news-feed'+i+'"></div>');
					$('.news-feed'+i).html(news);
					$('.infinite-container .item:nth-child('+i+')').remove();
				}
			
			}		
			$('.infinite-container').addClass('view-type-1 gu4 col').removeClass('row');
			
			 $('.infinite-container').infinitescroll({	 
				navSelector  : ".nextnav",            
				nextSelector : ".nextnav a.infinite-more-link",    
				itemSelector : ".infinite-container div.item",
				loading: {
		          finishedMsg: 'Ikke mere indhold',
		          img: '/img/ajax-loader.gif',
		          msgText: "Henter flere nyheder..."
			        
			      }
				})
				
			$('#content div.news-list').css('opacity', 1);
			
			break;
			
			case "view2":								
				
				var $container = $('.infinite-container');
				// initialize
				$container.addClass('view-type-2 gu6');
				$container.append('<div id="gutter"></div>') 
				$('.item').css('opacity', 0);
				
				$container.imagesLoaded( function() {
					$container.isotope({
						itemSelector : '.item',
						resizeable: true,
						masonry: {
					    	columnWidth: $container.width() / 5,
					    	gutterWidth: $container.width() / 5 / 4
						}
					},
					$('.item').css('opacity', 1)
					);
				});
						
				$(window).on("debouncedresize", function( event ) {
					$container.isotope({
						masonry: { columnWidth: $container.width() / 5, gutterWidth: $container.width() / 5 / 4 }
					})
				});

			    
				$('.infinite-container').infinitescroll({	 
			      navSelector  : ".nextnav",            
				  nextSelector : ".nextnav a.infinite-more-link",    
				  itemSelector : ".infinite-container div.item",
			   
			      loading: {
			          finishedMsg: 'Ikke mere indhold',
			          img: '/img/ajax-loader.gif',
			          msgText: "Henter flere nyheder..."
			        }
			      },
			      // trigger Masonry as a callback
			      function( newElements ) {
			        // hide new items while they are loading
			        var $newElems = $( newElements ).css({ opacity: 0 });
			        // ensure that images load before adding to masonry layout
			        $newElems.imagesLoaded(function(){
			          // show elems now they're ready
			          $newElems.animate({ opacity: 1 });
			          $container.isotope( 'appended', $newElems, true ); 
			        });
			      }
			    );
			    
			$('#content div.news-list').css('opacity', 0);
	    			
			break;
			
			case "view3":
			$('#content div.news-list').css('opacity', 0);
			$('.infinite-container').addClass('view-type-3 gu6');
			$('.infinite-container .item').addClass('col gu2');
			
			$('.infinite-container').infinitescroll({	 
			      navSelector  : ".nextnav",            
				  nextSelector : ".nextnav a.infinite-more-link",    
				  itemSelector : ".infinite-container div.item",
			      loading: {
			          finishedMsg: 'Ikke flere nyheder',
			          img: '/img/ajax-loader.gif',
			          msgText: "Henter flere nyheder..."

			        }
			      },
			      // trigger Masonry as a callback
			      function( newElements ) {
			        // hide new items while they are loading
			        var $newElems = $( newElements ).addClass('col gu2');
			        // ensure that images load before adding to masonry layout
			        
			      }
			    );
			
			break;	
			
			
			default:
			break;
		}
	
	
	
	

}