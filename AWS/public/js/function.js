
	var drawOnce = 0;
	
	function drawMap(){
	
	    var input = document.getElementById('srch').value;
	    
	    if(input == null || input == ""){
	        alert("Please enter in a query.");
	        return false;
	    }
		document.getElementById("select").style.opacity=0;
        document.getElementById("map").style.opacity=0;
        document.getElementById("legendbox").style.opacity=0;

	    document.getElementById("select").innerHTML = "You have searched for the opinion on: <strong>" + input + ".</strong>";

        document.getElementById("select").style.opacity=1;
        document.getElementById("map").style.opacity=1;
	    document.getElementById("legendbox").style.opacity=1;

	    if(drawOnce!=0){ return false; }
	    
	    drawOnce = 1;
	    
	    var color;
	    var svg;
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

	    var length = 100;
	    var color = d3.scale.linear().domain([1,length])
	        .interpolate(d3.interpolateHcl)
	        .range([d3.rgb("#FC0300"), d3.rgb('#FFF900')]);

	    var svg = d3.select("#map")
	        .append("svg")
	        .attr("width", width)
	        .attr("height", height);

	        d3.json("json/us-states.json", function(json) {
	            svg.selectAll("path")
	            .data(json.features)
	            .enter()
	            .append("path")
	            .attr("d", path)
	            .style("fill", function(d) {
	                // Get data value
	                var value = d.properties.value;

	                if (value) {
	                    //If value exists…
	                    return "#0666a5";
	                } else {
	                    //If value is undefined…
	                    return "#ccc";
	                }
	            });
	        });

	}

	function changeColor(state, value) {
	    var condition;
	    condition = color(value);
	    console.log(condition);
	    svg.selectAll("path")
	        .style("fill", function(d){
	            //console.log(d.proprties.name.toString());
	            // var stateName = d.properties["name"];
	            var stateName = d.properties["STATE_ABBR"];
	            // console.log(state);
	            if(stateName === state) {
	                return condition;
	            }
	            else {
	                return "#06666a5";
	            }
	        });
	}

	function getRandomArbitrary(min, max) {
	    return Math.floor(Math.random() * (max - min)) + min;
	}

	var requestHolder;
	function analyzeTextData(state, tweet) {
	    var data = generateJSON(tweet);
	    //console.log(data);
	    var request = new XMLHttpRequest();
	    request.open('POST', 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment');
	    request.setRequestHeader('Ocp-Apim-Subscription-Key', 'fd98ecfa17ca4b439fcf66166864b049');
	    request.setRequestHeader('Content-Type', 'application/json');
	    request.setRequestHeader('Accept', 'application/json');
	    request.send(data);
	    request.onreadystatechange = function () {
	        if (request.readyState == XMLHttpRequest.DONE) {
	            var r1 = request.responseText;
	    var results = JSON.parse(r1);
	            // console.log(results);
	            var score = results["documents"][0]["score"];
	            var scoreValue = score*100;
	            console.log(scoreValue);
	            changeColor(state, scoreValue);
	        }
	    }
	}
	function generateJSON(tweet) {
	    var jsonObject =
	        {
	            "documents": [
	                {
	                    "language": "en",
	                    "id": "1",
	                    "text": tweet
	                }
	            ]
	        };
	    var json = JSON.stringify(jsonObject);
	    return json;
	}

	function getRandomColor() {
	    var letters = '0123456789ABCDEF';
	    var color = '#';
	    for (var i = 0; i < 6; i++ ) {
	        color += letters[Math.floor(Math.random() * 16)];
	    }
	    return color;
	}

	function randomColoring(state, tweet){
	    var scoreValue = getRandomArbitrary(0,100);
	    changeColor(state, scoreValue);
	}

	function twitterQuery(search){
		console.log("twitter query");
		if(io !== undefined) {
		        // Storage for WebSocket connections
		        var socket = io.connect('/');

		        // This listens on the "twitter-steam" channel and data is 
		        // received everytime a new tweet is receieved.
		        socket.on('twitter-stream', function (data) {
		            // analyzeTextData(data.state,data.tweet);
		            // console.log(data);
		            console.log(data.tweet);
		            console.log(data.inputsocket);
		            console.log(data.state);
		            randomColoring(data.state,data.tweet);
		        });

		        // Listens for a success response from the server to 
		        // say the connection was successful.
		        socket.on("connected", function(r) {

		          //Now that we are connected to the server let's tell 
		          //the server we are ready to start receiving tweets.
		          socket.emit("start tweets", search);
		        });
		}
	}
window.onload=function(){
	document.getElementById("srch").addEventListener("keyup", function(event) {
	    event.preventDefault();
	    if (event.keyCode == 13) {
	        document.getElementById("srchBtn").click();
	    }
	});
}