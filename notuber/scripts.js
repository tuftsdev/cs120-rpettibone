const username = "yCA9BxBx";
const rideAPIurl = "https://sleepy-harbor-65621.herokuapp.com/rides";
const riderAPIurl = "https://sleepy-harbor-65621.herokuapp.com/riders";
const carImage = "./car.png";
const alienImage = "./alien.png";

var map;

var myLat = 0;
var myLng = 0;
var myLoc;
var moreCars;
var moreRiders;
var me;


/*function generateMarker(value) {
    return new google.maps.Marker({
        position: value.coords,
        map,
        title: value.id,
        icon: carImage,
    });
}*/

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
            map.panTo(me.getPosition());
            me.addListener('click', function(){calculateDistances(me);});
        });
    }
    else {
        alert("Geolocation is not supported.");
    }
}

function contactAPI(i) {
    var theParameter = "username=" + username + "&lat=" + myLat + "&lng=" + myLng;
    var xhr = new XMLHttpRequest();
    if (i==1){
        xhr.open('POST', rideAPIurl, true);
    }else{
        xhr.open('POST', riderAPIurl, true);
    }
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            if(i==1){
                useResponse1(xhr.responseText);
            }else{
                useResponse2(xhr.responseText);
            }
        }
    }
    xhr.send(theParameter);
}

function useResponse1(str) {
    moreCars = JSON.parse(str);
    moreCars.map(function(value){
        var pos = new google.maps.LatLng(value.lat, value.lng);
        new google.maps.Marker({
            position: pos,
            map,
            title: value.username,
            icon: carImage,
        });
    });
}

function useResponse2(str) {
    moreRiders = JSON.parse(str);
    moreRiders.map(function(value){
        var pos = new google.maps.LatLng(value.lat, value.lng);
        var x = new google.maps.Marker({
            position: pos,
            map,
            title: value.username,
            icon: alienImage,
        });
        x.addListener('click', function(){calculateDistances(x);});
    });
}

function calculateDistances(y){
    var x = moreCars.map(function(value){
        var carLoc = new google.maps.LatLng(value.lat, value.lng);
        return google.maps.geometry.spherical.computeDistanceBetween(y.getPosition(), carLoc)/1609;
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
        anchor: y,
        map,
    });
    var minLineCoords = [y.getPosition(), minLatLng];        
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
        center: { lat: myLat, lng: myLat},
        zoom: 2,
        });

    //cars.map(generateMarker);

    postMyLocation();
    contactAPI(1);
    contactAPI(2);
}
 
window.initMap = initMap;
