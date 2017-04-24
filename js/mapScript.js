function generateMap() {
  //Width and height
  var width = 960;
  var height = 600;

  //Map Projection
  var projection = d3.geo.albersUsa()
    .translate([width/2, height/2])
    .scale([1000]);

  //Path Generator
  var path = d3.geo.path()
    .projection(projection);

  var color = d3.scale.quantize()
    .range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,109,44)"]);

  var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

    d3.json("us-states.json", function(json) {
      svg.selectAll("path")
       .data(json.features)
       .enter()
       .append("path")
       .attr("d", path)
       .style("fill", function(d) {
          //Get data value
          var value = d.properties.value;
          
          if (value) {
            //If value exists…
            return color(value);
          } else {
            //If value is undefined…
            return "#ccc";
          }
        });
    });
}
