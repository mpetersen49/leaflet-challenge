console.log("logic.js loaded")

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(data => {
  console.log(data)
  createFeatures(data.features);  
});

var colors = ["#a3f600", "#dcf400", "#f7db11", "#fbd72a", "#fca35d", "#ff5f65"]

function createFeatures(earthquakeData) {
  
  function onEachFeature(feature, layer) {
    layer.bindPopup(`${feature.properties.place}, ${feature.geometry.coordinates[2]}`)
  };

  function getColors (d) {
    switch(true) {
      case d > 90:
        color = colors[5];
        break;
      case d > 70:
        color = colors[4];
        break;
      case d > 50:
        color = colors[3];
        break;
      case d > 30:
        color = colors[2];
        break;
      case d > 10:
        color = colors[1];
        break;
      case d > -10:
        color = colors[0];
        break;
    };
    return color
  };

  function getOptions(r, d) {
    return {
      radius: r*5,
      fillColor: getColors(d),
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
  };

  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, getOptions(feature.properties.mag, feature.geometry.coordinates[2]));
    }
  });

  createMap(earthquakes);

};

function createMap(earthquakes) {

  var map = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

  var overlayMaps = {
    Earthquakes: earthquakes
  };

  var myMap = L.map("mapid", {
      center: [40.7608, -111.8910],
      zoom: 5,
      layers: [map, earthquakes]
    });

  var legend = L.control({position: "bottomright"});

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [-10, 10, 30, 50, 70, 90];

    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:'+ colors[i] +'"></i> '+ grades[i] + (grades[i] ? "&ndash;" + grades[i + 1] + "<br>":"+");

    };
    return div;
  };

  legend.addTo(myMap);
     
};