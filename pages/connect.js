import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
let googleLocation;
let currentRoom;

const placeIDs = [
      "ChIJ85r3PVDGxokRRxuANkh-02E", // Lauder House
      "ChIJjxgbSlrGxokRLTQW2HfGauQ", // Houston Hall
      "ChIJse5PvlrGxokREZWEctK7-S0", // Towne Building
      "ChIJG6dwdFrGxokR2w5L_I1yApI", // Van Pelt Library
      "ChIJoaF8ilrGxokRJKa1HWIoj4w", // Fisher Library
      "ChIJzbTor0bHxokRgLa9dRGny_M", // Huntsman Hall
      "ChIJa-NXW1jGxokRlgP4lD5tRUI", // Amazommons
      "ChIJYZna5VnGxokR7g1MwvKOkGI", // Annenberg Center
      "ChIJy1A2YVfGxokRd0yJ-ZD5doU", // Pottruck Fitness Center
      "ChIJt437C1DGxokR0AzpBixAa80", // Hill College House
];

const buffer = 0.0003; // Adjusted buffer for boundary customization
const scalerrrr = 0.3; // Scale down by 60%
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const Connect = () => {
  const [geofences, setGeofences] = useState([]);
  const router = useRouter();

  useEffect(() => {
    
    if (apiKey) {
      loadGoogleMapsApi().then(() => {
        console.log("Google Maps API loaded");
        initializeGeofences();
      });
    }
  }, []);

  const loadGoogleMapsApi = () => {
    return new Promise((resolve) => {
      if (window.google) {
        resolve(window.google);
        return;
      } 

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
      script.async = true;
      script.onload = () => resolve(window.google);
      console.log("Succesfully logged");
      document.head.appendChild(script);
    
    });
  };

  const initializeGeofences = () => {
    const placesService = new google.maps.places.PlacesService(document.createElement("div"));

    placeIDs.forEach((placeID) => {
      const request = { placeId: placeID, fields: ["geometry", "name"] };
      placesService.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place.geometry.viewport) {
          const adjustedBounds = {
            northEast: {
              lat: place.geometry.viewport.getNorthEast().lat() - buffer * scalerrrr,
              lng: place.geometry.viewport.getNorthEast().lng() + buffer * scalerrrr,
            },
            southWest: {
              lat: place.geometry.viewport.getSouthWest().lat() + buffer * scalerrrr,
              lng: place.geometry.viewport.getSouthWest().lng() - buffer * scalerrrr,
            },
          };

          const polygonPaths = boundsToPolygonPaths(adjustedBounds);
          const polygon = new google.maps.Polygon({ paths: polygonPaths });

          setGeofences((prev) => [...prev, { zone: polygon, placeID }]);
          console.log("Geofences set");
        } else {
          console.error("Cannot load place details");
        }
      });
    });
    
  };

  const boundsToPolygonPaths = (bounds) => [
    { lat: bounds.northEast.lat, lng: bounds.northEast.lng },
    { lat: bounds.southWest.lat, lng: bounds.northEast.lng },
    { lat: bounds.southWest.lat, lng: bounds.southWest.lng },
    { lat: bounds.northEast.lat, lng: bounds.southWest.lng },
  ];

  const requestUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log(userLocation);

          googleLocation = new google.maps.LatLng(userLocation.lat, userLocation.lng);
          console.log(googleLocation);
          checkUserInZone(googleLocation);
          console.log("Google Location");

        },
        (error) => handleError(error)
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const checkUserInZone = (userLocation) => {
    let insideAnyZone = false;

    geofences.forEach((geofence) => {
      
      if (google.maps.geometry.poly.containsLocation(userLocation, geofence.zone)) {
        insideAnyZone = true;
        currentRoom = geofence.placeID;
        routeToRoom(geofence.placeID);
        console.log(`You are in ${currentRoom}`);
      }
    });

    if (!insideAnyZone) {
      alert("You are outside all PennChat zones.");
    }
  };

  const routeToRoom = (placeID) => {
    router.push({ pathname: `/room/${placeID}`, query: { id: placeID } });
  };

  const handleError = (error) => {
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
  };
  return (
    <div className="flex flex-col items-center text-center">
      <div className="info-container">
        <h1 className="penn-red title">Get Started</h1>
        <p className="penn-blue">Press 'connect' and allow location services to automatically join a room!</p>
      </div>
      <div>
        <Button variant="outlined" className="w-24 rounded-full" onClick={requestUserLocation}>Connect</Button>
      </div>
      <div className="flex flex-col sm:flex-row p-10">
        <div className="info-container">
          <h1 className="penn-red">What is QuakerChat?</h1>
          <p className="penn-blue">QuakerChat is an anonymous location-based chat service for Penn students. Simply press 'connect' to join a room based on your location. Room locations are grouped by major building.</p>
        </div>
        <div className="info-container">
          <h1 className="penn-red">Is my location shared or stored?</h1>
          <p className="penn-blue">No. Location services are only used to identify which major building a user is in. Location permissions can be changed at any time and your location is not shared with anyone else.</p>
        </div>
      </div>
    </div>
  );
}

export default Connect;
