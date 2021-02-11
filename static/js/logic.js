 
 var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 15,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });
  
  // Create map
  var myMap = L.map("map", {
    center: [
      39.8283, -102.5795
    ],
    zoom: 3.5,
    });
  
  streetmap.addTo(myMap);
  
  
  var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  d3.json(queryUrl, function(data) {
    function styleMap(feature) {
      console.log(feature)
      return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000000",
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
      };
    }
      // change color 
      function getColor(coordinates) {
      switch (true) {
      case coordinates < 10:
        return "#ffbdbd";
      case coordinates >= 10 && coordinates < 30:
        return "#ff5757";
      case coordinates >= 30 && coordinates < 50:
        return "#ff0000";
      case coordinates >= 50 && coordinates < 70:
        return "#c70000";
      case coordinates >= 70 && coordinates < 90:
        return "#870000";
      default:
        return "#400000";
      }
    }
      // calculate
      function getRadius(mag) {
      if (mag === 0) {
        return 1;
      }
      return mag * 5;
    }
      
      L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng);
        },
        style: styleMap,
        onEachFeature: function(feature, layer) {
          layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
      }).addTo(myMap);
      
      // create legend 
      var legend = L.control({
        position: "bottomright"
      });
      
      legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var depths = [-10,10,30,50,70,90];
      var colors = ["#ffbdbd", "#ff5757", "#ff0000", "#c70000", "#870000", "#400000"];
      
      for (var i = 0; i < depths.length; i++) {
        div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
        + depths[i] + (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
        console.log(colors[i]);
      }
      return div;
    };
  
    legend.addTo(myMap);
  
  });
  
  