/*
var width = 754,
    height = 700;
*/
var width = 600, height = 600;
var labelCoords = {
	"Staten Island": "(94, 416)",
	"Bronx": "(245, 115)",
	"Manhattan": "(170, 220)",
	"Queens": "(300, 240)",
	"Brooklyn": "(230, 330)",
}
/*
// Places into parallax scrolling
var svg = d3.select("#end").append("svg")
    .attr("width", width)
    .attr("height", height);
*/
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

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
	var labeldata = topojson.object(nyc, nyc.objects.boroughs_land).geometries;
	console.log(labeldata);
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

});
