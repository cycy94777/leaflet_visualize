
// create three tile layers.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    zoom: 3 ,
    subdomains:['mt0','mt1','mt2','mt3']
});

let topo = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']})

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
let plate = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// creating initial map object
let myMap = L.map("map", {
    center:[45.96044, -30.30695], zoom:3, 
    layers : [street]})

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
    let markers = []
    
    for (let i=0; i<data['features'].length; i++){
            
            markers.push(L.circleMarker([data['features'][i]['geometry']['coordinates'][1],data['features'][i]['geometry']['coordinates'][0]], {
                radius : data['features'][i]['properties']['mag']*3,
                fillColor : chooseColor(data['features'][i]['geometry']['coordinates'][2]),
                color : "#FBEEE6 ",
                weight : 1,
                opacity : 1,
                fillOpacity : 0.8
            }).bindPopup(`<h3>Magnitude: ${data['features'][i]['properties']['mag']}<h3><hr><h3>Depth: ${data['features'][i]['geometry']['coordinates'][2]}<h3>`))
            
        }
console.log(markers)
    //get the tectonic plates dataset and plot the tectonic plates
        d3.json(plate).then(function(data){
            let plate = L.geoJSON(data)
// create a layer group for earthquakes        
let markergroup = L.layerGroup(markers)
// create an overlayMaps object to contain the "earthquake" and "plate" layers
let overlayMap = {"earthquake":markergroup, 'plate':plate}
let baseMaps = {'street':street, 'satellite': googleSat, 'topo': topo}
// create a layer control that contains baseMaps and overlayMaps, and add them to the map.
L.control.layers(baseMaps, overlayMap).addTo(myMap)
}) })
    
    
    
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

;







