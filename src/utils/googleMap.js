import { setMap, setPage, setZoom } from "src/store/reducers/registerReport";

export const isWithinSAfrica = async (latitude, longitude) => {
  const geocoder = new window.google.maps.Geocoder();
  const latlng = new window.google.maps.LatLng(latitude, longitude);

  try {
    const results = await geocodeLatLng(geocoder, latlng);
    for (let i = 0; i < results.length; i++) {
      const addressComponents = results[i].address_components;
      for (let j = 0; j < addressComponents.length; j++) {
        if (addressComponents[j].types.includes("country") && addressComponents[j].short_name === "ZA") {
          return [{ latitude, longitude },true];
        }
      }
    }
    return [{ longitude: 28.034088, latitude: -26.195246 },false];
  } catch (error) {
    throw new Error("Geocoder failed due to: " + error.status);
  }
};

const geocodeLatLng = (geocoder, latlng) => {
  return new Promise((resolve, reject) => {
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK) {
        resolve(results);
      } else {
        reject(new Error(status));
      }
    });
  });
};

export const getLocationCoords = async () => {
  if (navigator.geolocation) {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const [values,_] = await isWithinSAfrica(latitude, longitude);
      
      return values;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  } else {
    console.error("GeoLocation not supported by your browser.");
    return null;
  }
};

export const loadGoogleMaps = (dispatch,lng,lat,zoom=12) => {
  const SatelliteTransition=15;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    window.initMap = async() => {
    const {latitude,longitude} = (lng===null||lat===null)?await getLocationCoords():{latitude:lat,longitude:lng};
     
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: latitude, lng: longitude },
        zoom,
        mapTypeId:zoom>SatelliteTransition?"satellite":"roadmap"
      });
      const mapDiv=document.getElementById('map');
      mapDiv.map=map;
      new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude }, // Latitude and longitude of the marker
        map:map,
        title: "Crime Location Marker", // Optional title for the marker
      });
      map.addListener("zoom_changed", () => {
        const zoomLevel = map.getZoom();
        dispatch(setZoom(zoomLevel));
        map.setMapTypeId(zoomLevel>SatelliteTransition?"satellite":"roadmap");
      });
      if(lng===null||lat===null){
        dispatch(setPage({latitude,longitude}))
      }
    };
  };