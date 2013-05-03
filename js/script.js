/**
 * Parallax Scrolling Tutorial
 * For Smashing Magazine
 * July 2011
 *   
 * Author: Richard Shepherd
 * 		   www.richardshepherd.com
 * 		   @richardshepherd   
 */

var currentSection = 0;

// On your marks, get set...
$(document).ready(function(){
	console.log("loaded");
	// Cache the Window object
	$window = $(window);

	// Set the spacing between facts
	var windowHeight = $window.height();
	var totalHeight = 6 * windowHeight;
	var cutoffHeight = $(document).height() - windowHeight;
	var cutoffReached = false;

	/*
	$(".story").css("height", windowHeight + "px");
	$(".left-side").css("height", (totalHeight) + "px");
	*/
	//$(".fact").css("margin", "0 0 " + windowHeight + "px 0");
	$(".fact").css("margin", "0 0 200px 0");
	
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
			//console.log($window.scrollTop());
			if ( ($window.scrollTop() + $window.height()) > (topOffset) &&
				 ( (topOffset + $self.height()) > $window.scrollTop() ) ) {
				var id = $self[0].id;

				// Scroll the background at var speed
				// the yPos is a negative value because we're scrolling it UP!								
				var windowTop = $window.scrollTop();
				var yPos = -(windowTop / $self.data('speed')); 

				
				// If this element has a Y offset then add it on
				if ($self.data('offsetY')) {
					yPos += $self.data('offsetY');
				}
				
				// Put together our final background position
				var coords = '50% '+ yPos + 'px';

				// Move the background
				$self.css({ backgroundPosition: coords });

				positionSprites($self);

				/*
				console.log(cutoffHeight);
				console.log(windowTop);
				*/
				if (!cutoffReached && windowTop > cutoffHeight) {
					cutoffReached = true;
					/*
					$(".map-parent").animate({"opacity": 1}, 1500);
					$("article").animate({"opacity": 0}, 1500);
					*/
				}
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
		//console.log(coords);
		
		$sprite.css({ backgroundPosition: coords });													
		// scroll sprites within the sprites
		$sprite.find('h1').css({
			'top': yPos,
			'left': xPos
		});
		$sprite.find('div').css({
			'top': yPos,
			'left': xPos
		});
	});
};
