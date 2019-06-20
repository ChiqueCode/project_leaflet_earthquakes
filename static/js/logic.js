// Creating a map object
var map = L.map("map", {
    center: [40.8540, -74.8291],
    zoom: 3
  });
  
  // Adding tile layer
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(map);

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Fucntion build a popup
// function buildPopup(feature) {
//   return `<h1>${feature.properties.place}</h1><hr/><span>${feature.properties.mag}</span>`
// }

// Function markersize that will give each magnitude a proper radius
function markerSize(magnitude) {
  return magnitude * 20000;
}


// Grab the data 
d3.json(url, function(response) {
  // console.log(response);

  // Store response features in a variable so it's easier to loop through coordinates
  var data = response.features;
  console.log(data);

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
    }

    // Adding circles/bubbles to the map
    L.circle(location, {
      fillOpacity: 0.7,
      color: magColor,
      fillColor: magColor,
      radius: markerSize(magnitude)
    }).bindPopup("<h1>" + place + "</h1><hr><h3>Magnitude: " + magnitude + "</h3>").addTo(map);
  }
});
  

