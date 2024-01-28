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

/**
  const onEachFeature = (feature, layer) => {
    if ((hasWon || hasGivenUp) && feature.properties && feature.properties.ADMIN) {
      const tooltipContent = feature.properties.ADMIN; // Assuming 'ADMIN' is the property name
      console.log('tooltipContent: ' + tooltipContent);
      layer.bindTooltip(tooltipContent);
    }
  };
*/

  const getStyle = (feature) => {
  const featureNameLower = feature.properties.ADMIN;
  // Get correct answers based on the initialCountry
  const correctAnswers = initialCountry ? bordersData[initialCountry.properties.ADMIN] : [];

  if (hasGivenUp && missedCountries.includes(featureNameLower)) {
    return { fillColor: '#dc3545', weight: 2, color: 'black', fillOpacity: 0.8 }; // Correct answers
  }
  if (highlightedCountries.includes(featureNameLower)) {
    return { fillColor: '#19cc54', weight: 2, color: 'black', fillOpacity: 0.8 }; // User highlighted countries
  } else if (initialCountry && featureNameLower === initialCountry.properties.ADMIN) {
    return { fillColor: '#2fcaff', weight: 2, color: 'black', fillOpacity: 1 }; // Initial country
  } else if (hasWon || hasGivenUp){
      return { fillColor: '#7E6C65', weight: 1, color: 'black', fillOpacity: .3 };
  }
  return { fillColor: 'gray', weight: 0, color: 'black', fillOpacity: 0 }; // Default style (don't show the country, set weight and opacity to 0)
};

  return (
    <MapContainer center={[51.505, -0.09]} zoom={2} style={{ height: '300px', width: '100%' }}>
      {
        countriesData && (<GeoJSON data={countriesData} style={getStyle}
/>)
      }
      {
        (initialCountry) && (<MapEffect initialCountry={initialCountry} />)
      }
    </MapContainer>
  );
}

export default GeoMap;
