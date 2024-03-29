// Defining the layers 
var street = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});

// Satellite base
var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-satellite",
  accessToken: API_KEY
});

// Defining baseLayers (only one will be shown at a time)
var baseMaps = {
  "Light": street,
  "Dark": dark,
  "Satellite": satellite
};  

// Construct the map object
var map = L.map("map", {
  center: [40.8540, -74.8291],
  zoom: 3,
  layers: [street, dark]
});


var urlEarth = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Fucntion build a popup
// function buildPopup(feature) {
//   return `<h1>${feature.properties.place}</h1><hr/><span>${feature.properties.mag}</span>`
// }

// Function markersize that will give each magnitude a proper radius
function markerSize(magnitude) {
return magnitude * 20000;
}

// Create a new Layer Group
// var earthquake = new L.LayerGroup();

// Create a variable geojson 
var geojson;

// Defining a new layer 
var earthLayer = new L.LayerGroup();

// Grab the data for earthquakes 
d3.json(urlEarth, function(response) {
// console.log(response);

// Store response features in a variable so it's easier to loop through coordinates
var data = response.features;
// console.log(data);

for (var i = 0; i<data.length; i++) {
  var latitude = data[i].geometry.coordinates[1];
  var longitude = data[i].geometry.coordinates[0];
  var location = [latitude, longitude];
  var magnitude = data[i].properties.mag;
  var place = data[i].properties.place;

  // Define the var magColor and assign an empty string for it so we can identify the color with the of statement
  var magColor = "";

  if (magnitude > 5) {
    magColor = "#302387"; 
  }
  else if (magnitude > 4) { 
    magColor = "#866ec7";
  }
  else if (magnitude > 3) {
    magColor = "#8f71ff";
  }
  else if (magnitude > 2) {
    magColor = "#82acff";
  }
  else if (magnitude > 1) {
    magColor = "#f2c0ff";
  }
  else {
    magColor = "#b7fbff"
  };

  // Adding circles/bubbles to the map
  L.circle(location, {
    fillOpacity: 0.7,
    color: magColor,
    fillColor: magColor,
    radius: markerSize(magnitude)
  }).bindPopup("<h1>" + place + "</h1><hr><h3>Magnitude: " + magnitude + "</h3>").addTo(map);
}

});

// Set up the legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var limits = ["0-1","1-2","2-3","3-4","4-5","5+"];
  var colors = ["#b7fbff", "#f2c0ff", "#82acff", "#8f71ff","#866ec7", "#302387"];
  var labels = [];

  // console.log(labels);

  var legendInfo = "<h1>Magnitude</h1>" +
  "<div class=\"labels\">" +
    "<div class=\"min\">" + limits[0] + "</div>" +
    "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
  "</div>";

  div.innerHTML = legendInfo;

  limits.forEach(function(limit, index) {
    labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
  });

  div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  return div;
};

legend.addTo(map);

// url for boundaries
var urlBound = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Defining a new Layer
var boundLayer = new L.LayerGroup();

// Gettig the data with d3 and plotting with geoJSON
d3.json(urlBound, function (geoJson) {
  L.geoJSON(geoJson.features, {
    style: function (geoJsonFeature) {
      return {
        weight: 1,
        color: "red"
      }
    },
  }).addTo(boundLayer);
})
// Defining the overlay maps

var overlayMaps = {
  "Fault Line": boundLayer,
  "Earthquake": earthLayer
}

L.control.layers(baseMaps, overlayMaps).addTo(map);



