(function(){
	/*D3.JS*/
	var width = 900;
	var height = 540;

	var projection = d3.geo.albersUsa();

	var color = d3.scale.linear()
		.domain([0, 15])
		.range(['#9bcef5', '#6cb7f0', '#3ea1ec', '#1689e0']);

	var svg = d3.select('#map').append('svg')
			.attr('width', width)
			.attr('height', height);

	var path = d3.geo.path()
	    .projection(projection);

	var g = svg.append('g');

	d3.json('json/us-states.json', function(error, topology) {
	    g.selectAll('path')
			.data(topojson.feature(topology, topology.objects.usStates).features)
			.enter()
			.append('path')
			.attr('class', function(d){ return 'states ' + d.properties.STATE_ABBR;} )
			.attr('d', path)
			.attr('fill', function(d, i) { return color(i); });
	});

	var faceIcon = svg.selectAll('image').data([0]);
}) ();