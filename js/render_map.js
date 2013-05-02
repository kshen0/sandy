/*
var width = 754,
    height = 700;
*/
var width = 600, height = 600;
var freezeDescription = false;
var labelCoords = {
	"Staten Island": "(94, 416)",
	"Bronx": "(245, 115)",
	"Manhattan": "(170, 220)",
	"Queens": "(300, 240)",
	"Brooklyn": "(230, 330)",
}
// Data for the proposed storm damage prevention projects
var projects = {
	"The Narrows Barrier": {
		"lineData": [ [{ "x": 190, "y": 386}, { "x": 196, "y": 380}],
					  [{ "x": 187, "y": 388.5}, {"x": 183, "y": 392}] ],
		"clickLine": [ { "x": 180, "y": 394}, { "x": 199, "y": 376} ],
		"cost": "6.5 billion",
		"description": "A rolling gates design just north of the Verrazano-Narrows Bridge. A pair of curved rolling sector gates would span an 870-foot opening in the center, adjoined by 16 lifting gates with a span of 130 feet, and two lifting gates with a span of 165 feet.",
		"link": "http://biotech.law.lsu.edu/climate/ocean-rise/against-the-deluge/15-verrazano_narrows_barrier.pdf"
	},
	"NY - NJ Outer Harbor Gateway": {
		"lineData": [ [{ "x": 263, "y": 519}, { "x": 265, "y": 508}], 
					  [{ "x": 266, "y": 504}, { "x": 270, "y": 480}], 
					  [{ "x": 271, "y": 475}, { "x": 272, "y": 469}], 
					  [{ "x": 273, "y": 465}, { "x": 277, "y": 432}], 
					  [{ "x": 278, "y": 429}, { "x": 286, "y": 426}]
					],
		"clickLine": [ { "x": 263, "y": 519}, { "x": 286, "y": 426} ],
		"cost": "5.9 billion",
		"description": "A five-mile long series of underwater gates stretching from Sandy Hook to the Rockaways. The design leaves three openings for ships to pass through.",
		"link": "http://biotech.law.lsu.edu/climate/ocean-rise/against-the-deluge/17-outer_harbor_gateway.pdf"
	},
	"Beach Fill Project": {
		"lineData": [ [{ "x": 228, "y": 421}, { "x": 239, "y": 421.5},
					   { "x": 257, "y": 416}], 
					],
		"clickLine": [ { "x": 228, "y": 421}, { "x": 257, "y": 416} ],
		"cost": "250 million",
		"description": "The process by which sediment (usually sand) lost through longshore drift or erosion is replaced from sources outside of the eroding beach. The first project was implemented on Coney Island in 1922-1923 and is currently maintained.",
		"link": "http://en.wikipedia.org/wiki/Beach_nourishment"
	},
	"Elevated Sand": {
		"lineData": [ [{ "x": 290, "y": 435}, { "x": 305, "y": 425}, 
					   { "x": 312, "y": 418}, { "x": 320, "y": 415},
					   { "x": 330, "y": 407}, { "x": 340, "y": 400}],					
					],
		"clickLine": [ { "x": 290, "y": 435}, { "x": 340, "y": 400} ],
		"cost": "20-100 million",
		"description": "An incomplete study suggests combating beach erosion on the Rockaways' beaches has seen periodic funding cuts since 2003.",
		"link": "http://www.thenewyorkworld.com/2012/11/15/john-cori/"
	},
	"Marsh Restoration": {
		"circleData": [{"cx": 350, "cy": 350, "radius": 5}],
		"clickLine": [ { "x": 345, "y": 345}, { "x": 355, "y": 355} ],
		"cost": "150 million",
		"description": "Protecting Jamaica Bay's marshes, which act as natural sponges during storms, by upgrading waste treatment and preventing the marshes from disappearing into the water altogether.",
		"link": "http://www.nytimes.com/2011/07/31/nyregion/jamaica-bay-a-wild-place-on-the-edge-of-change.html?pagewanted=all"
	},
	"ConEd Infrastructure Upgrade": {
		"circleData": [{"cx": 205, "cy": 260, "radius": 5}],
		"clickLine": [ { "x": 200, "y": 255}, { "x": 210, "y": 265} ],
		"cost": "250 million",
		"description": "Beefing up Manhattan's electrical grid to better withstand storms.",
		"link": "http://www.nytimes.com/2012/09/11/nyregion/new-york-faces-rising-seas-and-slow-city-action.html?pagewanted=1&_r=1&ref=nyregion"
	},
}

/*
// Places into parallax scrolling
var svg = d3.select("#end").append("svg")
    .attr("width", width)
    .attr("height", height);
*/
var svg = d3.select(".map").append("svg")
    .attr("width", width)
    .attr("height", height);

// Render the geography and geopgraphy lables
d3.json("./data/ny_coast.json", function(error, nyc) {
	var boroughs_water = topojson.object(nyc, nyc.objects.boroughs_water);	
	var boroughs_land = topojson.object(nyc, nyc.objects.boroughs_land);	
	var states = topojson.object(nyc, nyc.objects.states);	

	var projection = d3.geo.albers()
	    .scale(58000)
	    .translate([width / 2, height / 2])
	    .center([24.12, 40.67]);

	// Draw the projection
	var path = d3.geo.path()
		.projection(projection);

	// Draw the state boundaries
	svg.append("path")
		.datum(states)
		.attr("d", path);

	svg.selectAll(".state")
		.data(topojson.object(nyc, nyc.objects.states).geometries)
		.enter().append("path")
		.attr("class", 
			function(d) {
				return "state " 
				+ d.properties.name.replace(" ", "-");
			})
		.attr("d", path);

	// Draw the water boundaries
	svg.append("path")
		.datum(boroughs_water)
		.attr("d", path);

	svg.selectAll(".boroughs_water")
		.data(topojson.object(nyc, nyc.objects.boroughs_water).geometries)
		.enter().append("path")
		.attr("class", 
			function(d) {
				return ("boroughs_water " 
					+ d.properties.name.replace(" ", "-") + "-water");
			})
		.attr("d", path);

	// Draw the land boundaries
	svg.append("path")
		.datum(boroughs_land)
		.attr("d", path);

	svg.selectAll(".boroughs_land")
		.data(topojson.object(nyc, nyc.objects.boroughs_land).geometries)
		.enter().append("path")
		.attr("class", 
			function(d) {
				return "boroughs_land " 
				+ d.properties.name.replace(" ", "-") + "-land";
			})
		.attr("d", path);

	// append labels
	var labeldata = topojson.object(nyc, nyc.objects.boroughs_land).geometries;
	svg.selectAll(".place-label")
		.data(labeldata)
		.enter().append("text")
		.attr("class", "place-label")
		.attr("transform", function(d) { 
			return ("translate" 
				+ labelCoords[d.properties.name.replace("-", " ")]); 
			})
		.attr("dy", ".35em")
		.text(function(d) { return d.properties.name; });

	drawProjects();
});

function drawProjects() {
	// define line generator 
	var lineFunction = d3.svg.line()
		.x(function(d) {return d.x;})
		.y(function(d) {return d.y;})
		.interpolate("cardinal")
		.tension(.8);

	/*
	var circleFunction = d3.svg.circle()
		.x(function(d) {return d.x;})
		.y(function(d) {return d.y;})
		.r(function(d) {return d.r;})
	*/



	for (var name in projects) {
		var nameDashes = name.replace(/ /g, "_");
		var g = svg.append("g")
			.attr("id", nameDashes)
			.attr("class", "hover-entity");

		var p = projects[name];
		// Append lines
		var lines = p["lineData"];
		for (var line in lines) {
			var newline = g.append("path")
						  .attr("d", lineFunction(lines[line]))
						  .attr("class", "project")
		}

		// Append the invisible fat line that makes the clickable g larger
		g.append("path")
			.attr("d", lineFunction(p["clickLine"]))
			.attr("class", "invis");

		// append circles
		if ("circleData" in p) {
			var circles = g.selectAll("circle")
				.data(p["circleData"])
				.enter()
				.append("circle");

			// circle generator
			var circleAttributes = circles
				.attr("cx", function (d) { return d.cx; })
				.attr("cy", function (d) { return d.cy; })
				.attr("r", function (d) { return d.radius; })
				.attr("class", "project-circle");

			g.selectAll("circle")
				.data(p["circleData"])
				.enter()
				.append("circle");
		}

		var modalText = $("#modal-text");
		d3.selectAll(".hover-entity")
			.on("click", function() {
				freezeDescription = !freezeDescription;
			})
			.on("mouseenter", function() {
				showText(modalText, $(this));
			})
			.on("mouseleave", function() {
				if (!freezeDescription) {
					modalText.animate({"opacity": "0"}, function() {
						modalText.html("");
					});
				}
			});
	}
	// set styles for all "project" paths
	svg.selectAll(".project")
		.attr("stroke", "#c0392b")
		.attr("stroke-width", 2);
		//.attr("fill", "#c0392b");

	svg.selectAll(".project-circle")
		.attr("stroke", "#c0392b")
		.attr("fill", "#c0392b")
		.attr("opacity", "0.7")
		.attr("stroke-width", 2);

	// set styles for all "invis" paths
	svg.selectAll(".invis")
		.attr("stroke", "#c0392b")
		.attr("stroke-width", 20)
		.attr("stroke-opacity", "0.0");
};

function showText(modalText, that) {
	if (!freezeDescription && modalText.html() == "") { 
		// lol this is the worst
		name = that[0].id.replace(/_/g, " ");
		var p = projects[name];
		var title = "<h3><a href='" + p["link"] + "'>" + name + "</a></h3>";
		modalText.append(title)
				 .append("<h3>Estimated cost: $" + p["cost"] + "</h3>")
				 .append("<br><p>" + p["description"] + "</p>");
		modalText.animate({"opacity": "1"});
	}
};
