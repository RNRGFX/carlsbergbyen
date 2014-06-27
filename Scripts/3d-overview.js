
$(document).ready(function(){


	$('.mapwrapper .interactive img:first, .mapwrapper .static img:first').show();

    var svg_cont =  Snap("#svg");
	var c = 1;
	var group = [];
	var currView = '00';
	var prefix = '3D';
	var ratio = 0.65069444444444;
  	var factor = 1;
  	var imgLoadet = 0;
  	var firstrun = true;
  	
	var handlr = function(rel){
		
		svg_cont.clear();
     				
		for (var i in buildings){
			loadSvg(i, rel, '3D');
        }  
    }
    
    function loadSvg(i, rel, submap){
    
	    var url = buildings[i]['SVGpath']+submap+'/svg/'+buildings[i]['ID']+'_00'+rel+'.svg';       
       
        Snap.load(url,function(f){        	
        
            var g = f.select('g');
            var path = f.selectAll('path');
            
            if(!buildings[i]['showSlider']) {
            	path.attr({fill: '#ee7b17', cursor: 'inherit'});
			} else {
				path.attr({fill: '#b01d34'});
			}
			
			path.attr({'class' : buildings[i]['hilight']})
						                       
			g.click(function (event) {
				event.stopPropagation();
				$('#hoverpop').fadeOut(200);
				if(buildings[i]['showSlider']) {
					showInfoBox(i);
				} else {
					$('#whitebox .closer').trigger('click');
				}
			}).hover(function(){
				$('#hoverpop .cell').html(buildings[i].Name).parent().parent().stop(true, true).show();
			}, function(){
				$('#hoverpop').delay(100).fadeOut(200);
			})
			
			g.dblclick(function(event) {
			  event.preventDefault();
			  location.href = buildings[i].Url;
			});
			
			
						
            svg_cont.append(g);   
           
        })	 
	 }
	 
	// init first view  
    handlr(currView);
    
    var mouse_position_x,
		mouse_position_y
    
    $( window ).on( "mousemove", function( event ) {
	  mouse_position_x =  event.pageX;
	  mouse_position_y = event.pageY;
	});
    
    $( "#wrapper_3d" ).mousemove(function( event ) {
		$('#hoverpop').css({'left':event.pageX-130, 'top':event.pageY-80})
  	});
  	
  	
  	
  	
  	function showInfoBox(prop){
  	  	
		var htmlString = '<a class="closer"></a>',
			data = buildings[prop];
			leftPosSpan = $(window).width()/3,
			topPosSpan = $( "#wrapper_3d" ).height()/2+200,
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
		

			
		htmlString += '<h2>'+data.Name+'</h2>';
		htmlString += '<div class="meta">'+data.Parent+'</div>';
		htmlString += '<div class="imgwrapper"><img src="'+data.Thumbnail+'" /></div>';
		if (data.Description != "") htmlString += '<div class="desc">'+data.Description+'</div>';
		htmlString += '<a class="readmore" href="'+data.Url+'">'+data.Readmore+'</a>';
		$('#whitebox .inner').html(htmlString);
		
		
		$('#whitebox').css({'display':'block', 'opacity': 1,'left':mouse_position_x,'top':mouse_position_y});
		//$('#whitebox .tut').css({'top':mouse_position_y-parseInt($('#whitebox').css('top'))});
		
		$('#whitebox .closer').click(function(e){
			e.stopPropagation();			
			$('#whitebox').css('opacity', 0)
			setTimeout(function(){$('#whitebox').hide()}, 200);
			return false;
		})
		
		$(document).keyup(function(e) {
			if (e.keyCode == 27) {
			  	$('#whitebox .closer').trigger('click');
			  	}
		   // esc
		})
		
		
				
	}
		
	$('html').click(function(){
		$('#whitebox .closer, #help .closer').trigger('click');
	});
	
	

	
	$(window).scroll(function() {
		var dif = $('#whitebox').height() - $('#whitebox .inner').height() -50;
		var top = $(window).scrollTop();
		if (dif < top){
			$('#whitebox .inner').addClass('float');
		} else {
			$('#whitebox .inner').removeClass('float');			
		}
	});
		

		
	var rotater = function(direction, counter){
		$('#hoverpop').fadeOut(200);
		$('#guide').css('opacity',0)
		$('#whitebox .closer, #help .closer').trigger('click');		
	
		var currentImage = $('#imgwrapper3D .interactive img:visible');
		clearTimeout(nextImageTimer);
		var nextImage;
		svg_cont.clear();
		
		if (counter < 4){
			switch(direction){
				case "next":
					nextImage = currentImage.next().attr('rel') ? currentImage.next() : $('#imgwrapper3D .interactive img:first');
				break;
				
				case "prev":
					nextImage = currentImage.prev().attr('rel') ? currentImage.prev() : $('#imgwrapper3D .interactive img:last');
				break;
			}
			
			var parallelNextImage = $('#imgwrapper3D .static img[rel="'+nextImage.attr('rel')+'"]');
			var parallelCurrentImage = $('#imgwrapper3D .static img[rel="'+currentImage.attr('rel')+'"]');
						
			parallelNextImage.show();
			parallelCurrentImage.hide();
			nextImage.show();
			currentImage.hide();
			
			var nextImageTimer = setTimeout(function(){
				rotater(direction, counter+1);
			}, 50);
		} else {
			if (Number(currentImage.attr('rel')) % 4 == 0)	handlr(currentImage.attr('rel'));
		}
		
		currView = currentImage.attr('rel')
		$('#nord').attr('class','s'+currView);
		
	}
	
	
	$('#next').click(function(){
		if (prefix == '3D') rotater('next', 0);
		return false;
	})
	
	$('#prev').click(function(){
		if (prefix == '3D') rotater('prev', 0);
		return false;		
	})
	
	$(document).keydown(function(e) {
		if (e.keyCode == 37){
			if (prefix == '3D') rotater('prev', 0);
		}
		
		if (e.keyCode == 39){
			if (prefix == '3D') rotater('next', 0);
		}
	})
	
	$('#mapview').click(function(){
		var mp = $(this);
		
		$('#next, #prev, #guide, #staticlegend').fadeOut();
		$('#imgwrapper2D, #legend').fadeIn();
		$('#whitebox .closer, #help .closer').trigger('click');
		$('#figures').show();
		svg_cont.clear();
     	
     	
     	$('#viewtoggles .active').removeClass('active');
     	mp.addClass('active');
     	
     	prefix = '2D';
	    newView = '00';
	    $('#nord').attr('class','s00');
		 	
     	     				
		for (var i in buildings){		
			loadSvg(i, newView, prefix);
        }  		
		return false;
	})
	
	
	$('#interactive').click(function(){
		$('#viewtoggles .active').removeClass('active');
	    $(this).addClass('active');
	    $('#figures').show();
	    $('#legend').fadeIn()
	     $('#staticlegend').fadeOut();
	     $('#whitebox .closer, #help .closer').trigger('click');
		
		if (prefix == '2D'){
			$('#next, #prev').fadeIn();
			$('#imgwrapper2D, #imgwrapper3D .static').fadeOut();
			$('#whitebox .closer').trigger('click');
			svg_cont.clear();
	     	     		     	
	     	prefix = '3D';
		    newView = currView;
		    $('#nord').attr('class','s'+currView);
			 	
	     	     				
			for (var i in buildings){		
				loadSvg(i, newView, prefix);
	        }  		
			
		} else {
			$('#imgwrapper3D .static').fadeOut();
		}
		
		return false;
	})
	
	$('#static').click(function(){
		$('#viewtoggles .active').removeClass('active');
	    $(this).addClass('active');
	    $('#figures').hide();
	    $('#legend').fadeOut()
	    $('#staticlegend').fadeIn();
	    $('#whitebox .closer, #help .closer').trigger('click');

		if (prefix == '2D'){
			$('#next, #prev, #imgwrapper3D .static').fadeIn();
			$('#imgwrapper2D').fadeOut();
			$('#whitebox .closer').trigger('click');
			svg_cont.clear();
	     	     	     	
	     	
	     	prefix = '3D';
		    newView = currView;
		    $('#nord').attr('class','s'+currView);
			 	
	     	     				
			for (var i in buildings){		
				loadSvg(i, newView, prefix);
	        }  		
			
		} else {
			$('#imgwrapper3D .static').fadeIn();
		}
		
		return false;
	})
	
	
	// Help box:
	
	if($.cookie('carlsberg-show-help')){
		if ($.cookie('carlsberg-show-help') === 'false'){
			$('#help').css({'top':900, 'right':20, 'opacity':0});
			$('#wrapper_3d .interactive, #helplink').show();
			$('#wrapper_3d .static').fadeOut(900);
			firstrun = false;
		}
	} 
	
	$('#help .closer').click(function(){
	
		$.cookie('carlsberg-show-help', 'false', { expires: 300, path: '/' });
		

		$('#help').stop().animate({'top':$('#wrapper_3d').height()+212, 'right':20, 'opacity':0}, function(){
			$('#helplink').fadeIn();
				
			if (firstrun){
				$('#wrapper_3d .interactive').show();
				$('#wrapper_3d .static').fadeOut(900);
				
				firstrun = false;
			}
			//setTimeout(function(){$('#guide').fadeOut()}, 2000)
				
		})	
		return false;
	})
	
	$('#helplink').click(function(){
	
		$.cookie('carlsberg-show-help', 'true', { expires: 300, path: '/' });
	
		$('#help').stop().animate({'top':'50%', 'right':'50%', 'opacity':1}, function(){
			$('#helplink').fadeOut();
		})	
		return false;
	})

	$(document).keyup(function(e) {
		if (e.keyCode == 27) {
		  	$('#help .closer').trigger('click');
		  	}
	   // esc
	})
	
	
	function resizeCanvas(){
		factor = ($(window).width() < 1450) ? 0.7 : 1;
		$('#wrapper_3d').height($(this).width()*ratio*factor);
	}
	
	$(window).resize(function(){
		resizeCanvas();
	})
	
	resizeCanvas();
	
	$('#wrapper_3d').imagesLoaded( function() {
		resizeCanvas();
		$('#loading').fadeOut()
		$('#legend, #prev, #next, #figures').fadeIn(500);
		$('#viewtoggles').height(32)			
		
	}).progress( onProgress )
	
	function onProgress( imgLoad, image ) {
		imgLoadet++;
		$('#loading span').text(imgLoadet)
		
	}
	
	
	
	
});
