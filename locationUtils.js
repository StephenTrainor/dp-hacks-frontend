// locationUtils.js

export function checkUserInZone(userLocation, placesService, placeData, geofences, onInsideZone) {
    const userLatLng = new google.maps.LatLng(userLocation.lat, userLocation.lng);
    
    const placePromises = placeData.map(({ id }) => new Promise((resolve) => {
      const request = { placeId: id, fields: ["geometry"] };
      placesService.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place.geometry) {
          resolve({ place, id });
        } else {
          resolve(null);
        }
      });
    }));
  
    Promise.all(placePromises).then((results) => {
      let insideAnyZone = false;
      results.forEach((result, index) => {
        if (result && geofences[index]?.type === "polygon") {
          const polygon = geofences[index].zone;
          if (google.maps.geometry.poly.containsLocation(userLatLng, polygon)) {
            insideAnyZone = true;
            const { name, type } = placeData[index]; // Access name/type from placeData
            onInsideZone(result.id, name, type);
          }
        }
      });
      if (!insideAnyZone) {
        console.log("Outside of all zones");
      }
    });
  }
  