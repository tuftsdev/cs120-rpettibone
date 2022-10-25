const username = "yCA9BxBx";
const rideAPIurl = "https://jordan-marsh.herokuapp.com/rides";
const carImage = "./car.png";

let map;
let cars = [{id: "mXfkjrFw", coords: {lat: 42.3453, lng:-71.0464}}, 
            {id: "nZXB8ZHz", coords: {lat: 42.3662, lng:-71.0621}}, 
            {id: "Tkwu74WC", coords: {lat: 42.3603, lng:-71.0547}}, 
            {id: "5KWpnAJN", coords: {lat: 42.3472, lng:-71.0802}}, 
            {id: "uf5ZrXYw", coords: {lat: 42.3663, lng:-71.0544}}, 
            {id: "VMerzMH8", coords: {lat: 42.3542, lng:-71.0704}}];

var myLat = 0;
var myLng = 0;
var myLoc;


function generateMarker(value) {
    return new google.maps.Marker({
        position: value.coords,
        map,
        title: value.id,
        icon: carImage,
    });
}

function postMyLocation() {

    if (navigator.geolocation) { 
        navigator.geolocation.getCurrentPosition(function(position) {
            myLat = position.coords.latitude;
            var myLng = position.coords.longitude;
            myLoc = new google.maps.LatLng(myLat, myLng);
            var me = new google.maps.Marker({
                position: myLoc,
                map,
                title: "Meeeeee",
            });
            me.setMap(map);
        });
    }
    else {
        alert("Geolocation is not supported by your web browser.  What a shame!");
    }
}

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 42.352271, lng: -71.05524200000001},
        zoom: 14,
        });

    cars.map(generateMarker);

    postMyLocation();
    //console.log(myLat);
    /*new google.maps.Marker({
        position: myLoc,
        map,
        title: "Meeeeee",
    });*/
}
 
window.initMap = initMap;