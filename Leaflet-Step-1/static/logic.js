// Store API query variables
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


function markerSize(mag) {
	return mag * 30000;
}

function markerColor(depth) {
	if (depth <= 10) {
		return "#ffffb2";
	}
	else if (depth <= 30) {
		return "#f5e0a1";
	}
	else if (depth <= 50) {
		return "#e9b78b";
	}
	else if (depth <= 70) {
		return "#de9277";
	}
	else if (depth <= 90) {
		return "#d16860";
	}
	else{
		return "#b10026";
	}
}
// Grab the data with d3
d3.json(url, function(response) {
	createFeatures(response.features);
});

// function to create circles
function createFeatures(data) {

	var earthquakeInfo = L.geoJSON(data, {

	onEachFeature: function(feature, layer) {
		layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " + feature.properties.mag + "</p>")
	},
	pointToLayer: function(feature, coord) {
		return new L.circle(coord,
			{radius: markerSize(feature.properties.mag),
			fillColor: markerColor(feature.geometry.coordinates[2]),
			fillOpacity: 0.8,
			color: "white",
			weight: 1
			})
	}
	});

	createMap(earthquakeInfo);
}

function createMap(earthquakeInfo) {

 	var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    	attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    	tileSize: 512,
    	maxZoom: 18,
    	zoomOffset:-1,
    	id: "mapbox/streets-v11",
    	accessToken: API_KEY
  	});

  	// Define a baseMaps object to hold our base layer
	var baseMaps = {
    	"Street Map": streetmap,
	};


  	// Create our map with streetmap and earthquakeinfo layers
	var myMap = L.map("map", {
    	center: [39.828175, -98.5795],
    	zoom: 4,
    	layers: [streetmap, earthquakeInfo]
  	});


	// Adding tile layer to the map
	// L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
 //  		attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
	// 	tileSize: 512,
 //  		maxZoom: 18,
 //  		zoomOffset: -1,
 //  		id: "mapbox/streets-v11",
 //  		accessToken: API_KEY
	// }).addTo(myMap);


// Legend
var legend = L.control({position: "bottomright"});

legend.onAdd = function() {
	var div = L.DomUtil.create('div', 'info legend');
		var magnitudes = [-10,10,30,50,70,90];

	var lengendInfo = "<h4>Eathquake Depth</h4>" 
	div.innerHTML = lengendInfo;

	for (var i = 0; i < magnitudes.length; i++) {
		div.innerHTML += '<i style = "background: ' +
		markerColor(magnitudes[i] + 1) + 
		'"></i> ' + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + 
		'<br>' : ' + ')
	}
	return div;
};
	legend.addTo(myMap);
};
