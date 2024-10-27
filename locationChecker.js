// LocationChecker.js

import React, { useRef, useState, useEffect } from 'react';
import { useGooglePlacesService, useUserLocation, checkUserInZone } from './locationUtils';
import { placeData } from './placeData';

function LocationChecker({ geofences }) {
  const mapRef = useRef(null);
  const placesService = useGooglePlacesService(mapRef);
  const { userLocation, error } = useUserLocation();
  const [currentZone, setCurrentZone] = useState(null);
  const [currentPlaceInfo, setCurrentPlaceInfo] = useState({ name: '', type: '' });

  const handleZoneEntry = (id, name, type) => {
    setCurrentZone(id);
    setCurrentPlaceInfo({ name, type });
    console.log(`Inside zone with place ID: ${id}`);
  };

  useEffect(() => {
    if (userLocation && placesService) {
      checkUserInZone(userLocation, placesService, placeData, geofences, handleZoneEntry);
    }
  }, [userLocation, placesService, geofences]);

  if (error) return <p>Error: {error}</p>;
  if (!userLocation) return <p>Loading location...</p>;

  return (
    <div>
      {currentZone ? (
        <p>
          You are inside a zone! <br />
          Place: {currentPlaceInfo.name} <br />
          Type: {currentPlaceInfo.type}
        </p>
      ) : (
        "Outside of all zones"
      )}
    </div>
  );
}

export default LocationChecker;
