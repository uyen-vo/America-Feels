	var drawOnce=0;
	var color;
	var svg;
	var searchTerm = "";

	var stateInfo = [
		{state : "AL", count : 0, totalPoints : 0, average : 0},
		{state : "AK", count : 0, totalPoints : 0, average : 0},
		{state : "AZ", count : 0, totalPoints : 0, average : 0},
		{state : "AR", count : 0, totalPoints : 0, average : 0},
		{state : "CA", count : 0, totalPoints : 0, average : 0},
		{state : "CO", count : 0, totalPoints : 0, average : 0},
		{state : "CT", count : 0, totalPoints : 0, average : 0},
		{state : "DE", count : 0, totalPoints : 0, average : 0},
		{state : "FL", count : 0, totalPoints : 0, average : 0},
		{state : "GA", count : 0, totalPoints : 0, average : 0},
		{state : "HI", count : 0, totalPoints : 0, average : 0},
		{state : "ID", count : 0, totalPoints : 0, average : 0},
		{state : "IL", count : 0, totalPoints : 0, average : 0},
		{state : "IN", count : 0, totalPoints : 0, average : 0},
		{state : "IA", count : 0, totalPoints : 0, average : 0},
		{state : "KS", count : 0, totalPoints : 0, average : 0},
		{state : "KY", count : 0, totalPoints : 0, average : 0},
		{state : "LA", count : 0, totalPoints : 0, average : 0},
		{state : "ME", count : 0, totalPoints : 0, average : 0},
		{state : "MD", count : 0, totalPoints : 0, average : 0},
		{state : "MA", count : 0, totalPoints : 0, average : 0},
		{state : "MI", count : 0, totalPoints : 0, average : 0},
		{state : "MN", count : 0, totalPoints : 0, average : 0},
		{state : "MS", count : 0, totalPoints : 0, average : 0},
		{state : "MO", count : 0, totalPoints : 0, average : 0},
		{state : "MT", count : 0, totalPoints : 0, average : 0},
		{state : "NE", count : 0, totalPoints : 0, average : 0},
		{state : "NV", count : 0, totalPoints : 0, average : 0},
		{state : "NH", count : 0, totalPoints : 0, average : 0},
		{state : "NJ", count : 0, totalPoints : 0, average : 0},
		{state : "NM", count : 0, totalPoints : 0, average : 0},
		{state : "NY", count : 0, totalPoints : 0, average : 0},
		{state : "NC", count : 0, totalPoints : 0, average : 0},
		{state : "ND", count : 0, totalPoints : 0, average : 0},
		{state : "OK", count : 0, totalPoints : 0, average : 0},
		{state : "OH", count : 0, totalPoints : 0, average : 0},
		{state : "OR", count : 0, totalPoints : 0, average : 0},
		{state : "PA", count : 0, totalPoints : 0, average : 0},
		{state : "RI", count : 0, totalPoints : 0, average : 0},
		{state : "SC", count : 0, totalPoints : 0, average : 0},
		{state : "SD", count : 0, totalPoints : 0, average : 0},
		{state : "TN", count : 0, totalPoints : 0, average : 0},
		{state : "TX", count : 0, totalPoints : 0, average : 0},
		{state : "UT", count : 0, totalPoints : 0, average : 0},
		{state : "VT", count : 0, totalPoints : 0, average : 0},
		{state : "VA", count : 0, totalPoints : 0, average : 0},
		{state : "WA", count : 0, totalPoints : 0, average : 0},
		{state : "WV", count : 0, totalPoints : 0, average : 0},
		{state : "WI", count : 0, totalPoints : 0, average : 0},
		{state : "WY", count : 0, totalPoints : 0, average : 0}
	];

	//When a new keyword is beign searched, clear the map and the averages for the each state
	function input(){
		reset();
		searchTerm = document.getElementById('srch').value;
	    
	    if(searchTerm == null || searchTerm == ""){
	        alert("Please enter in a query.");
	        return false;
	    }
	    drawMap();
	}

	//The map should be recolored to its original state once it starts a new keyword along with starting it's total averages at 0 again.
	function reset(){
		d3.json("json/us-states.json", function(json) {
	            svg.selectAll("path")
	            .style("fill", function() {
	                return "#ccc";
	            });
	        });

		for (var i=0; i < stateInfo.length; i++) {
	        stateInfo[i].count = 0;
	        stateInfo[i].totalPoints = 0;
	        stateInfo[i].average = 0;
	    }
	}

	//Draw the JSON file using the D3.js API and later using it to color the state necessary once analyzed for emotions
	function drawMap(){
		document.getElementById("wrapper").style.overflowY = "visible";
	    document.getElementById("select").innerHTML = "You have searched for the opinion on: <strong>" + searchTerm + ".</strong>";
        document.getElementById("select").style.opacity=1;
        document.getElementById("map").style.opacity=1;
	    document.getElementById("legendbox").style.opacity=1;

	    if(drawOnce!=0){ return false; }
	    
	    drawOnce = 1;
	    // twitterQuery(searchTerm);
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
	    color = d3.scale.linear().domain([1,length])
	        .interpolate(d3.interpolateHcl)
	        .range([d3.rgb("#FC0300"), d3.rgb('#FFF900')]);

	    svg = d3.select("#map")
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

	            svg.selectAll("path")
			    .data(json.features)
			    .enter()
			    .append("text")
			    .text(function(d){
			        for (var i=0; i < stateInfo.length; i++) {
	       				if (stateInfo[i].state === d.properties.name){
	       					return stateInfo[i].average;
	       				}
	       			}
			    })
			    .attr("x", function(d){
			        return path.centroid(d)[0];
			    })
			    .attr("y", function(d){
			        return  path.centroid(d)[1];
			    })
			    .attr("text-anchor","middle")
			    .attr('font-size','6pt');
	        });

	}

	//Change the color of the state if a tweet was found with the respective state location
	function changeColor(state, value) {
	    var condition;
	    condition = color(value);
	    console.log(condition);
	    svg.selectAll("path")
	        .style("fill", function(d){
	            var stateName = d.properties["STATE_ABBR"];
	          
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

	//Analyze the tweet using Microsoft Congnitve API in order to find the appropriate value and change its color based on this value
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

	function randomColoring(state, tweet){
	    var scoreValue = getRandomArbitrary(0,100);
	    for (var i=0; i < stateInfo.length; i++) {
	        if (stateInfo[i].state === state) {
	            stateInfo[i].totalPoints+=scoreValue;
	            stateInfo[i].count++;
	            if(stateInfo[i].totalPoints!= 0 && stateInfo[i].count != 0){
		            stateInfo[i].average = stateInfo[i].totalPoints/stateInfo[i].count;
		        }

		        scoreValue = stateInfo[i].average;
		        break; 
	        }
	    }

	    changeColor(state, scoreValue);
	}

	//Begin the streaming without being called and filter out all locations by United States. 
	//Call on twitterQuery to analyze the text for the specific keyword
	if(io !== undefined) {
        // Storage for WebSocket connections
        var socket = io.connect('/');

        // This listens on the "twitter-stream" channel and data is received everytime a new tweet is receieved.
        socket.on('twitter-stream', function (data) {
        	//Analyze if specific tweet contains the keyword
            twitterQuery(data.tweet, data.state);
        });
        // Listens for a success response from the server to say the connection was successful.
        socket.on("connected", function(r) {
          //Tell server we are ready to start receiving tweets.
          socket.emit("start tweets");
        });
	}

	//Analyze if specific keyword can be found in tweet and if it is found, then analyze the tweet for an emotion
	function twitterQuery(state, tweet){
		// console.log("twitter query");
		console.log(searchTerm);
		var n = tweet.toLowerCase().search(searchTerm);
        
        //If keyword found, analyze the text for emotion
        if(n > -1){
        	console.log("VERIFY: " + tweet);
        	console.log(state);
      		randomColoring(state,tweet);
      		// analyzeTextData(state,tweet);
        }
        //If keyword not found, output the result in order to check streaming along with if it is false
       	else{
        	console.log("FALSE: " + tweet);
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