
$(document).ready(function(){
	
	var submenuHeight = 38;
	var menuHideTimeout;
	var mainWidth;
	
	// make (and others) to links:
	try{
	$('.bodytext, .description, #footer').linkify();
	} catch(err){}
		
	// show/hide search header column
		var hideSearchCats = setInterval(function(){
			if($('#sitesearch').val() == ''){
				$('#search .row.headers').hide()
			} else {
				$('#search .row.headers').show()	
			}
		}, 200);
						   
	// ajax search	
	var content = $('#sitesearch').val();
	$('#sitesearch').keyup(function() {
		if ($('#sitesearch').val() != content) {
			content = $('#sitesearch').val();
			$.ajax({
			   type: "POST",
			   url: "/datakilder/searchresults/",
			   data: "searchstring=" + content,
			   success: function(msg){
				 $('#searchresults').html('<div class="row"><div class="row headers"><div class="col gu3 yellow">Søgeresultat:</div><div class="col gu2 yellow">Kategori:</div><div class="col gu1 yellow">Dato:</div></div></div>'+msg);
				 $('#search .headers').show();
			   }
			});                                                                                      
		}
	});
	
	
	$('#search.topdrop .row.bottomline .clearFilter').click(function(){
		$('#sitesearch').val('');
		$('#sitesearch').trigger('keyup');
	})
		
	// key events for search
	$(document).keyup(function(e) {
	
		
		// TODO: keys for navigation in searchresults
		
		if (e.keyCode == 27) {
			if($('#sitesearch').val() != ''){
			  	$('#sitesearch').val('');
			  	$('#sitesearch').trigger('keyup');
			} else {
				$('#search.topdrop').removeClass('visible');
			}
		}   // esc
		
		
		
		
		if(e.keyCode == 38) {
		  //Move selection up
		}
		
		if(e.keyCode == 40) {
			
			var $selected = $('#searchresults .gu6')
			
			if ($('#searchresults .gu6').hasClass('selected') || !$('#searchresults .gu6:last').hasClass('selected')){			
				$('#searchresults .gu6.selected').removeClass('selected').next().addClass('selected');
			} else {
				$('#searchresults .gu6:first').addClass('selected');
			}
		}
		
		if(e.keyCode == 13) {
		  //Act on current selection
		}
	
	});
	
	// check for cookie acceptance
	if(!$.cookie('accept-cookies')){
		$('#cookies').show();
	}
	
	$('#cookies .closer').click(function(){		
		$.cookie('accept-cookies', 'true', { expires: 365, path: '/' });
		$('#cookies').fadeOut();
		return false;	
	})
	 
	
	

	// navigation desktop dropdown
	$('#header #navigation ul.navigation > li.nolink > a').hover(function(e){
	
		if($(window).width() > 760){
			// remove old classes:
			$('#header #navigation ul.submenu').removeClass('single double');
			// add class to submenu:
			$(this).next().addClass('single');
			// add class to header and toppadding
			$('#header #navigation').addClass('single');
			
		}

		return false;
	})
	
	$('#header #navigation ul.submenu > li.nolink > a').hover(function(){
		if($(window).width() > 760){
		
	
			// reset classes:
			$('#header #navigation ul.subsubmenu').removeClass('single');
			// reset hovering state for all menus
			$('#header #navigation ul.submenu li.nolink a').removeClass('hovering')
			// add hovering class to current:
			$(this).addClass('hovering');
			// add class to current submenu:
			$(this).parent().parent().addClass('double')
			// add class to current subsubmenu:
			$(this).next().addClass('single')
			
			$('#header #navigation').addClass('double')	
		}	
		return false;
	})
	
	$('#header #navigation ul.navigation > li:not(.nolink) > a').hover(function(){
		if($(window).width() > 760){
			// set all menus to 0
			moveSubMenus();
		}	
	})
	
	$('#header').hover(function(){
		clearTimeout(menuHideTimeout)
	}, function (){
		hideSubMenus();
	})
	
	function hideSubMenus(){
		menuHideTimeout = setTimeout(function(){
			moveSubMenus();	
		}, 500)

	}
	
	$('#header #navigation ul.navigation li.nolink > a').click(function(){
		return false;
	})
	
	$('#header #navigation ul li:nth-child(n+6)').addClass('nth-child-np6');
	$('#header #navigation ul li:nth-child(5)').addClass('nth-child-5');
	
	//navigation centering
	function moveSubMenus(){
		// add padding to the navigation
		pad = ($(window).width() - $('.gu6').width())/2
		$('#header.desktop #navigation').css('padding-left', pad+'px');
		
		
		$('#header #navigation ul.submenu, #header #navigation').removeClass('single double');
		$('#header #navigation ul.subsubmenu').removeClass('single');
		$('#header.desktop #navigation ul li a.hovering').removeClass('hovering');

		
		$('#header.desktop #navigation ul.submenu, #header.desktop #navigation ul.subsubmenu').each(function(){
			var parentCenter = $(this).prev().position().left
			/*$(this).css('padding-left', parentCenter);*/
		})
				
		// mobile:
		$('#header.mobile #navigation li.current > ul').show()		 
				
	}
	
	
	
	$(window).load(function(){
		moveSubMenus();
		$('#navigation').fadeIn(100);
	})
	
	
	$('#header.desktop #header #navigation li.current > ul').css('opacity',1).show()
	


	// trigger headerstate
	
	if (!minimenu){
	
		// yellowphant scrolltop
		$("#elephant-logo").click(function() {
		  $("html, body").animate({ scrollTop: 0 }, "slow");
		  return false;
		});
	
	    $('#header #trigger').waypoint(function(direction) {
	    	switch(direction){
		    	case 'up':
		    	$('#header').removeClass('stuck');
		    	break;
		    	
		    	case 'down':
		    	$('#header').addClass('stuck');
		    	break;
	    	}
		});
	} else {
		$('#header').addClass('stuck');
	}
	
	
	// show newsletter topdrop
	$('#header .newsletters, #footer #newsletterSignup').click(function(e){
		e.preventDefault;
		$('.topdrop:not(#newsletter)').removeClass('visible')
		$('#newsletter.topdrop').toggleClass('visible');
		return false;		
	})
	
	$('#newsletter .closer').click(function(e){
		e.preventDefault;
		$('#newsletter.topdrop').removeClass('visible');
		$('#mce-responses').slideUp();
		return false;
	})
	
	// show search topdrop
	$('#header .toplinks .search, #header #msearch').click(function(e){
	
		e.preventDefault;
		$('.topdrop:not(#search)').removeClass('visible')
		$('#search.topdrop').toggleClass('visible');
		$('#search.topdrop input.search').focus();
		return false;
	})
	
	$('#search .closer').click(function(e){
		e.preventDefault;
		$('#search.topdrop').removeClass('visible');
		return false;
	})
	
	// mobile menu
	$('#header #menu-drop').click(function(e){
		//$('html').toggleClass('gray');
		$('.topdrop').removeClass('visible')
		$('#header').toggleClass('down');
		$('#footer').toggle();
		$('#container').toggleClass('gone');
	})
	
	
	$(document).scroll(function() {
		//$('#header').removeClass('down');
	});
	
	$(window).resize(function(){
		resize();	
	})
	
	function resize(){
		moveSubMenus();
		mainWidth = ($(window).width() > 1240) ? 1140 : 960; 
		
		if ($(window).width() > 760){
			$('#container').css('min-height',window.innerHeight-440);
			$('#header').addClass('desktop').removeClass('mobile');
			
		} else {

			$('#header').addClass('mobile').removeClass('desktop');
			$('#navigation').css('height',window.innerHeight-160)
		}
		
	}
	
	resize();
	
	$('#topimages').imagesLoaded( function() {
		$('#topimages').css('opacity', 1);
		moveTopImage($('#topimages .cycle-slide-active:first img'));
		
		var triggerTime = setTimeout(function(){
			moveTopImage($('#topimages .cycle-slide-active:first img'));	
		}, 50);
		

	});
	
	$('#topimages').on('cycle-before', function( event, opts, outgoingSlideEl, incomingSlideEl, forwardFlag ) {
	
		
		var triggerTime = setTimeout(function(){
			moveTopImage($(incomingSlideEl).find('img'));	
		}, 50);
	
	    if($(incomingSlideEl).hasClass('Hvid')) $('#topimagewrapper').css({'transition':'background 1000ms','background':'black'});
	    if($(incomingSlideEl).hasClass('Sort')) $('#topimagewrapper').css({'transition':'background 1000ms','background':'white'});
	});
	
	
	function moveTopImage(img){
		if ($(window).width() > 760){
			var dif = ($('#topimages').height()	- img.height())/2;
			if (dif < 0) img.css('margin-top',dif);
		}
	}

	
	// toggle share button	
	if($('#shares')){
	
		$('.shareholder.yellowbutton').click(function(){
			$('#shares').fadeToggle(200);
			return false;
		})
		
		$('html').click(function(){
			$('#shares').fadeOut();
		});
		
		$('#shares').click(function(event){
		    event.stopPropagation();
		});
	}
	
	// mobile menu toggle
	$("#header.mobile .nolink > a").append('<span></span>');
	$("#header.mobile .nolink a").click(function(){
		$(this).toggleClass("downs");
		$(this).next().slideToggle();
	});
	
});
