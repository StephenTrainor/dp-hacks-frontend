let map;
let placesService;
const geofences = []; // polygon storage

// plcIDS
const placeIDs = [
  "ChIJ85r3PVDGxokRRxuANkh-02E", // Lauder House
  "ChIJjxgbSlrGxokRLTQW2HfGauQ", // Houston Hall
  "ChIJ-TtujFrGxokR0D-x_jYjVPk", // Towne Building
  "ChIJG6dwdFrGxokR2w5L_I1yApI", // Van Pelt Library
  
  "ChIJzbTor0bHxokRgLa9dRGny_M", // Huntsman Hall
  "ChIJL_SyZVjGxokRxJ-o2q0tzNs", // Amazommons
  "ChIJYZna5VnGxokR7g1MwvKOkGI", // Annenberg Center
  "ChIJy1A2YVfGxokRd0yJ-ZD5doU", // Pottruck Fitness Center
  "ChIJt437C1DGxokR0AzpBixAa80", // Hill College House
  "ChIJWwwY1WjHxokRZgh-LqRIEVw", // Class of 1949 Bridge (Huntsman 2)

  "ChIJQb_9HPjGxokR4i6aMZ-Iprg", // Acme and Radian
  "ChIJvaGgkVnGxokR7R5f0vmVCNQ", // Steinberg-Dietrich

  "ChIJucFPsFDGxokROWifFHCA5ik", // Kings-Court, English House

];

function initMap(userLocation) {
  document.getElementById("map").style.display = "block";

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 16,
    center: userLocation,
  });

  placesService = new google.maps.places.PlacesService(map);

  // Draw geofences for each place ID
  placeIDs.forEach((placeID) => fetchPlaceDetails(placeID));

  // user in ??
  checkUserInZone(userLocation);
}

function fetchPlaceDetails(placeID) {
  const request = { placeId: placeID, fields: ["geometry", "name"] };

  placesService.getDetails(request, (place, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && place.geometry) {
      drawGeofence(place);
    } else {
      console.error("Cannot load place details");
    }
  });
}

const buffer = 0.0003; // shrink fences
const scalerrrr = 2.1; // Scale down
const scalerrrrW = 0.4;

function drawGeofence(place) {
const { location, viewport } = place.geometry;
const placeID = place.place_id;
let latAdjustment = 0;
let longAdjustment = 0;
if (placeID === "ChIJ85r3PVDGxokRRxuANkh-02E") {
latAdjustment = -1; 
longAdjustment = -1; 
}

if (viewport) {
const adjustedBounds = {
  northEast: {
    lat: viewport.getNorthEast().lat() - (buffer * scalerrrr - latAdjustment),
    lng: viewport.getNorthEast().lng() + (buffer * scalerrrrW - longAdjustment)
  },
  southWest: {
    lat: viewport.getSouthWest().lat() + (2*buffer * scalerrrr - latAdjustment),
    lng: viewport.getSouthWest().lng() + (7*buffer * scalerrrrW - longAdjustment)
  }
};

const polygon = new google.maps.Polygon({
  paths: boundsToPolygonPaths(adjustedBounds),
  strokeColor: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#FF0000",
  fillOpacity: 0.35,
  map: map,
});
geofences.push({ type: "polygon", zone: polygon });

};
}

function boundsToPolygonPaths(bounds) {
return [
{ lat: bounds.northEast.lat, lng: bounds.northEast.lng },
{ lat: bounds.southWest.lat, lng: bounds.northEast.lng },
{ lat: bounds.southWest.lat, lng: bounds.southWest.lng },
{ lat: bounds.northEast.lat, lng: bounds.southWest.lng },
];
}

function requestUserLocation() {
if (navigator.geolocation) {
navigator.geolocation.getCurrentPosition(
  (position) => {
    const userLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    document.getElementById("status").innerText = `Location: ${userLocation.lat}, ${userLocation.lng}`;
    initMap(userLocation); // Initialize map (don't need in front-end anymore)
  },
  (error) => {
    handleError(error);
  }
);
} else {
alert("Location not supported.");
}
}

function handleError(error) {
switch (error.code) {
case error.PERMISSION_DENIED:
  alert("You denied the request for your location.");
  break;
case error.POSITION_UNAVAILABLE:
  alert("Location information is unavailable.");
  break;
case error.TIMEOUT:
  alert("The request to get your location timed out.");
  break;
default:
  alert("An unknown error occurred.");
}
}

function checkUserInZone(userLocation) {
const userLatLng = new google.maps.LatLng(userLocation);
let insideAnyZone = false;

const placePromises = placeIDs.map((placeID, index) => {
return new Promise((resolve) => {
  const request = { placeId: placeID, fields: ["geometry"] };
  placesService.getDetails(request, (place, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && place.geometry) {
      resolve({ place, index });
    } else {
      resolve(null);
    }
  });
});
});

Promise.all(placePromises).then((results) => {
results.forEach((result) => {
  if (result) {
    const { place, index } = result;
    const geofence = geofences[index];

    if (geofence.type === "polygon") {
      if (google.maps.geometry.poly.containsLocation(userLatLng, geofence.zone)) {
        insideAnyZone = true;
        console.log(`You are inside a PennChat zone! Place ID: ${placeIDs[index]}`);
      }
    } else if (geofence.type === "circle") {
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        userLatLng,
        geofence.zone.getCenter()
      );
      if (distance <= geofence.zone.getRadius()) {
        insideAnyZone = true;
        console.log(`You are inside a PennChat zone! Place ID: ${placeIDs[index]}`);
      }
    }
  }
});

if (!insideAnyZone) {
  alert("You are outside all PennChat zones.");
  console.log("Outside of all PennChat zones");
} else {
  alert("You are inside a PennChat zone!");
}
});
}



// Sending the current PlaceID to DB

function send_curr_user() {
if (navigator.geolocation) {
navigator.geolocation.getCurrentPosition(
  (position) => {
    const userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    const closestPlaceID = findClosestPlace(userLocation);
    
    if (closestPlaceID) {
      // Send the place ID to the database
      sendToDatabase(closestPlaceID);
    } else {
      alert("No nearby place found.");
    }
  },
  (error) => {
    console.error("Error getting user location:", error);
  }
);
} else {
alert("Geolocation is not supported by this browser.");
}
}


function findClosestPlace(userLocation) {
let minDistance = Infinity;
let closestPlaceID = null;

placeIDs.forEach((placeID) => {
const request = { placeId: placeID, fields: ["geometry"] };
placesService.getDetails(request, (place, status) => {
  if (status === google.maps.places.PlacesServiceStatus.OK && place.geometry && place.geometry.location) {
    const placeLocation = place.geometry.location;
    const dist = google.maps.geometry.spherical.computeDistanceBetween(userLocation, placeLocation);

    if (dist < minDistance) {
      minDistance = dist;
      closestPlaceID = placeID;
    }
  }
});
});

return closestPlaceID;
}

function sendToDatabase(placeID) {
// Replace with DB logic
console.log(`Sending placeID ${placeID}...'`);

}
