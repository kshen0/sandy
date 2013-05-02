var width = 754,
    height = 700;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);


d3.json("./data/ny_coast.json", function(error, nyc) {
	var boroughs_water = topojson.object(nyc, nyc.objects.boroughs_water);	
	var boroughs_land = topojson.object(nyc, nyc.objects.boroughs_land);	
	var states = topojson.object(nyc, nyc.objects.states);	

	/*
	var projection = d3.geo.mercator();
		.scale(250)
		.translate([width/2, height/2]);
	*/	

	var projection = d3.geo.albers()
	    .scale(55000)
	    .translate([width / 2, height / 2])
	    .center([24.19, 40.7]);

	    /*
	    .scale(1000)
	    .translate([width / 2, height / 2]);
	    .rotate([4.4, 0])
	    .parallels([50, 60]);
	    */

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
				console.log(d);
				return "state " 
				+ d.properties.name.replace(" ", "-");
			})
		.attr("d", path);

	// Draw the water boundaries
	/*
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
	*/

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

	
	/*
	svg.append("path")
		.datum(topojson.mesh(nyc, nyc.objects.subunits, function(a, b) { return a !== b && a.id !== "IRL"; }))
		.attr("d", path)
		.attr("class", "subunit-boundary");
	*/
});