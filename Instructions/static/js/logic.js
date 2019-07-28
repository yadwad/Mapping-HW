// Store our API endpoint inside queryUrl
// var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
//   "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

//-----------------------------------------------------------------------------------

// return color based on value
function getColor(x) {
  return x > 5 ? "#f40202" :
         x > 4 ? "#f45f02" :
         x > 3 ? "#f49702" :
         x > 2 ? "#F4bc02" :
         x > 1 ? "#d8f402" :
         x > 0 ? "#93f402" :
              "#FFEDA0";
}


function createFeatures(earthquakeData) {


// style function
function style(feature) {
  return {
    color: "red",
    fillColor: getColor(feature.properties.mag),
    fillOpacity: 0.85,
    opacity: 1,
    weight: 1,
    stroke: true,
    radius: +feature.properties.mag*6
  };
}

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJson(earthquakeData, {

          pointToLayer: function(feature, latlng) {

             //console.log("markersize: "+markerSize);
              //return L.circleMarker(latlng,  geojsonMarkerOptions );
              return L.circleMarker(latlng,  style(feature) );
          },
          onEachFeature: function (feature, layer) {
              //console.log("place: " + feature.properties.place);
              layer.bindPopup("<h3>" + feature.properties.place + "<hr>Magnitude: "
              + +feature.properties.mag + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
          }

      // console.log(earthquakes);

  });

  // var plates = L.geoJson(plateData, {
  //   onEachFeature: function (feature, layer) {
  //     layer.bindPopup("<h3>" + feature.properties.PlateName + "</h3>");
  //   }
  // });


// Sending the earthquakes layer to the createMap function
createMap(earthquakes);
}

function createMap(earthquakes) {

// Define streetmap and darkmap layers
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoibWJlcmtvdzIwMTciLCJhIjoiY2pjc2F4NGRvMGM0ZjJxdDZ6djRlNTR6YSJ9.Oc2zQ8daxeQJBYht7nDUzQ" );


var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoibWJlcmtvdzIwMTciLCJhIjoiY2pjc2F4NGRvMGM0ZjJxdDZ6djRlNTR6YSJ9.Oc2zQ8daxeQJBYht7nDUzQ" );

var satmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoibWJlcmtvdzIwMTciLCJhIjoiY2pjc2F4NGRvMGM0ZjJxdDZ6djRlNTR6YSJ9.Oc2zQ8daxeQJBYht7nDUzQ" );


// Define a baseMaps object to hold the base layers
var baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap,
  "Satellite Map": satmap,
};

// Create overlay object to hold the overlay layer for each base layer
var overlayMaps = {
  Earthquakes: earthquakes,
  
};


  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}


//Add legend 