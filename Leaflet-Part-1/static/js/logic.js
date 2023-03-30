let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// creating initial map object
let myMap = L.map("map", {
    center:[45.96044, -30.30695], zoom:3})

// Add a tile layer.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// create a function for choosing color (according to the depth of earthquake)
function chooseColor(depth){
    if (depth >= -10 && depth < 10){
        return "#AED581"}
    else if (depth >= 10 && depth <30){
        return "#66BB6A"}
    else if (depth >= 30 && depth <50){
        return "#FFB74D"}
    else if (depth >= 50 && depth <70){
        return "#FF9800"} 
    else if (depth >= 70 && depth <90){
        return "#FF7043"}       
    else {
        return "#BF360C"
    }
    }

// get data and make circle marker
d3.json(url).then(function(data){
    console.log("hi",data)
    let geojson = L.geoJSON(data, {
        pointToLayer : function(feature, latlng) {
            return L.circleMarker(latlng, {
                // earthquakes with higher magnitudes appear larger
                radius : feature['properties']['mag']*3,
                // earthquakes with greater depth appear darker in color
                fillColor : chooseColor(feature['geometry']['coordinates'][2]),
                color : "#FBEEE6 ",
                weight : 1,
                opacity : 1,
                fillOpacity : 0.8
            // binding a popup to each layer
            }).bindPopup(`<h3>Magnitude: ${feature['properties']['mag']}<h3><hr><h3>Depth: ${feature['geometry']['coordinates'][2]}<h3>`)
        }}).addTo(myMap)
        
    
    // create a legend to display information about the map.
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
    // create(<String> tagName, <String> className?)
    var div = L.DomUtil.create("div", "info legend");
    let scales = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"]
    let colors = ["#AED581", "#66BB6A", "#FFB74D", "#FF9800", "#FF7043", "#BF360C" ]
    var labels = [];

    
    var legendInfo = 
      "<div class=\"labels\">" +
        
      "</div>";
    // insert a div with the class of "labels"
    div.innerHTML = legendInfo;
    // set and add scale of colors to legend
    scales.forEach(function(scale, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\">"+ "</li>"+ scale);
    });

    div.innerHTML += "<ul>" + labels.join("<br>") + "</ul>";
    console.log(div.innerHTML)
    return div;
    
  };

  // adding the legend to the map
  legend.addTo(myMap);

});







