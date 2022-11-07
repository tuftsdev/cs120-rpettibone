const username = "yCA9BxBx";
const rideAPIurl = "https://rocky-beach-05736.herokuapp.com/rides";
const carImage = "./car.png";

var map;
var cars = [{id: "mXfkjrFw", coords: {lat: 42.3453, lng:-71.0464}}, 
            {id: "nZXB8ZHz", coords: {lat: 42.3662, lng:-71.0621}}, 
            {id: "Tkwu74WC", coords: {lat: 42.3603, lng:-71.0547}}, 
            {id: "5KWpnAJN", coords: {lat: 42.3472, lng:-71.0802}}, 
            {id: "uf5ZrXYw", coords: {lat: 42.3663, lng:-71.0544}}, 
            {id: "VMerzMH8", coords: {lat: 42.3542, lng:-71.0704}}];

var myLat = 0;
var myLng = 0;
var myLoc;
var moreCars;
var me;


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
            myLng = position.coords.longitude;
            myLoc = new google.maps.LatLng(myLat, myLng);
            me = new google.maps.Marker({
                position: myLoc,
                map,
                title: "Meeeeee",
            });
            me.setMap(map);
            me.addListener('click', calculateDistances);
            contactAPI();
        });
    }
    else {
        alert("Geolocation is not supported.");
    }
}

function contactAPI() {
    var theParameter = "username=" + username + "&lat=" + myLat + "&lng=" + myLng;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', rideAPIurl, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            useResponse(xhr.responseText);
        }
    }
    xhr.send(theParameter);
}

function useResponse(str) {
    moreCars = JSON.parse(str);
    moreCars.map(function(value){
        var pos = new google.maps.LatLng(value.lat, value.lng);
        return new google.maps.Marker({
            position: pos,
            map,
            title: value.username,
            icon: carImage,
        });
    });

}

function calculateDistances(){
    var x = moreCars.map(function(value){
        var carLoc = new google.maps.LatLng(value.lat, value.lng);
        return google.maps.geometry.spherical.computeDistanceBetween(myLoc, carLoc)/1609;
    });
    var minDist = Math.min(...x);
    var minIndex = x.indexOf(minDist);
    var minUsername = moreCars[minIndex].username;
    var minLatLng = new google.maps.LatLng(moreCars[minIndex].lat, moreCars[minIndex].lng);
    var windowHTML = "<p>Closest Car: " + minUsername + "</p><p>Distance: " + minDist + " miles</p>";
    var infowindow = new google.maps.InfoWindow({
        content: windowHTML,
        ariaLabel: "",
    });
    infowindow.open({
        anchor: me,
        map,
    });
    var minLineCoords = [myLoc, minLatLng];        
    var minLine = new google.maps.Polyline({
        path: minLineCoords,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
    });
    minLine.setMap(map);
}

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 42.352271, lng: -71.05524200000001},
        zoom: 14,
        });

    cars.map(generateMarker);

    postMyLocation();
}
 
window.initMap = initMap;
