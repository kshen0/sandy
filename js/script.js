/**
 * Parallax Scrolling Tutorial
 * For Smashing Magazine
 * July 2011
 *   
 * Author: Richard Shepherd
 * 		   www.richardshepherd.com
 * 		   @richardshepherd   
 */

// On your marks, get set...
$(document).ready(function(){
	console.log("loaded");
	// Cache the Window object
	$window = $(window);

	// Set the spacing between facts
	var windowHeight = $window.height();
	var totalHeight = 6 * windowHeight;
	$(".fact").css("margin", "0 0 " + windowHeight + "px 0");
	$("article").css({
		"margin-bottom": windowHeight + "px",
		"min-height": totalHeight + "px"
	});
	$("#container").css("min-height", totalHeight + 200 + "px");
	
	// Cache the Y offset and the speed of each sprite
	$('[data-type]').each(function() {	
		$(this).data('offsetY', parseInt($(this).attr('data-offsetY')));
		$(this).data('Xposition', $(this).attr('data-Xposition'));
		$(this).data('speed', $(this).attr('data-speed'));
	});
	
	// For each element that has a data-type attribute
	$('section[data-type="background"]').each(function(){
	
	
		// Store some variables based on where we are
		var $self = $(this),
			offsetCoords = $self.offset(),
			topOffset = offsetCoords.top;
		
		positionSprites($self);

		// When the window is scrolled...
	    $(window).scroll(function() {
	
			// If this section is in view
			console.log($window.scrollTop());
			if ( ($window.scrollTop() + $window.height()) > (topOffset) &&
				 ( (topOffset + $self.height()) > $window.scrollTop() ) ) {
	
				// Scroll the background at var speed
				// the yPos is a negative value because we're scrolling it UP!								
				var yPos = -($window.scrollTop() / $self.data('speed')); 
				
				// If this element has a Y offset then add it on
				if ($self.data('offsetY')) {
					yPos += $self.data('offsetY');
				}
				
				// Put together our final background position
				var coords = '50% '+ yPos + 'px';

				// Move the background
				$self.css({ backgroundPosition: coords });
				
			
				positionSprites($self);
				// Check for any Videos that need scrolling
				/*
				$('[data-type="video"]', $self).each(function() {
					
					// Cache the video
					var $video = $(this);
					
					// There's some repetition going on here, so 
					// feel free to tidy this section up. 
					var yPos = -($window.scrollTop() / $video.data('speed'));					
					var coords = (yPos + $video.data('offsetY')) + 'px';
	
					$video.css({ top: coords });													
					
				}); // video	
				*/
			
			}; // in view
	
		}); // window scroll
			
	});	// each data-type

}); // document ready

// position the sprites in this section
function positionSprites(section) {
	// Check for other sprites in this section	
	$('[data-type="sprite"]', section).each(function() {
		
		// Cache the sprite
		var $sprite = $(this);
		
		// Use the same calculation to work out how far to scroll the sprite
		var xPos = $sprite.data('Xposition');
		var yPos = -($window.scrollTop() / $sprite.data('speed'));					
		var yPos = yPos + $sprite.data('offsetY');
		var coords = xPos + ' ' + yPos + 'px';
		
		//console.log(yPos);
		$sprite.css({ backgroundPosition: coords });													
		$sprite.find('h1').css({
			'top': yPos,
			'left': xPos
		});
	});
};
