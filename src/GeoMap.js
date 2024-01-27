import React, { useState, useEffect } from 'react';
import { MapContainer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

function MapEffect({ initialCountry }) {
  const map = useMap();

  useEffect(() => {
    if (initialCountry) {
      const bounds = L.geoJSON(initialCountry.geometry).getBounds();
      map.fitBounds(bounds, { maxZoom: 5 }); // Adjusted maxZoom for initial zoom out
    }
  }, [map, initialCountry]);

  return null;
}

function GeoMap({ dataUrl, initialCountry, hasGivenUp, bordersData, highlightedCountries, missedCountries, resetGame }) {
  const [countriesData, setCountriesData] = useState(null);

  useEffect(() => {
    fetch(dataUrl)
      .then(res => res.json())
      .then(data => {
        setCountriesData(data);
      })
      .catch(err => console.error(err));
  }, [dataUrl]);

  const getStyle = (feature) => {
    //TODO fix this name_en thing. should probably just be .name on a consolidated list of data once the geojson 
    //dataset matches the bordering countries
  const featureNameLower = feature.properties.ADMIN.toLowerCase();
  // Get correct answers based on the initialCountry
  const correctAnswers = initialCountry ? bordersData[initialCountry.properties.ADMIN].map(name => name.toLowerCase()) : [];

  if (hasGivenUp && missedCountries.includes(featureNameLower)) {
    return { fillColor: 'red', weight: 2, color: 'black', fillOpacity: 0.6 }; // Correct answers
  }
  if (highlightedCountries.includes(featureNameLower)) {
    return { fillColor: 'green', weight: 2, color: 'black', fillOpacity: 0.6 }; // User highlighted countries
  } else if (initialCountry && featureNameLower === initialCountry.properties.ADMIN.toLowerCase()) {
    return { fillColor: 'blue', weight: 2, color: 'black', fillOpacity: 0.6 }; // Initial country
  }
  return { fillColor: 'transparent', weight: 0, color: 'black', fillOpacity: 0 }; // Default style
};

  return (
    <MapContainer center={[51.505, -0.09]} zoom={2} style={{ height: '350px', width: '100%' }}>
      {
        countriesData && (
        <GeoJSON data={countriesData} style={getStyle} />
      )
      }
      {
        (initialCountry) && (
        <MapEffect initialCountry={initialCountry} />
      )
      }
    </MapContainer>
  );
}

export default GeoMap;
