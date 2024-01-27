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

function GeoMap({ dataUrl, initialCountry, hasGivenUp, hasWon, bordersData, highlightedCountries, missedCountries, resetGame }) {
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
  const featureNameLower = feature.properties.ADMIN;
  // Get correct answers based on the initialCountry
  const correctAnswers = initialCountry ? bordersData[initialCountry.properties.ADMIN] : [];

  if (hasGivenUp && missedCountries.includes(featureNameLower)) {
    return { fillColor: 'red', weight: 2, color: 'black', fillOpacity: 0.6 }; // Correct answers
  }
  if (highlightedCountries.includes(featureNameLower)) {
    return { fillColor: 'green', weight: 2, color: 'black', fillOpacity: 0.6 }; // User highlighted countries
  } else if (initialCountry && featureNameLower === initialCountry.properties.ADMIN) {
    return { fillColor: 'blue', weight: 2, color: 'black', fillOpacity: 0.6 }; // Initial country
  } else if (hasWon || hasGivenUp){
      return { fillColor: 'gray', weight: 1, color: 'black', fillOpacity: .3 };
  }
  return { fillColor: 'gray', weight: 0, color: 'black', fillOpacity: 0 }; // Default style (don't show the country, set weight and opacity to 0)
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
