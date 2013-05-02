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
$.ajaxSetup({"async": false});
var projects = {};
$.getJSON("../data/proposed_projects.json", function(result) {
	projects = result;
});
$.ajaxSetup({"async": true});


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
