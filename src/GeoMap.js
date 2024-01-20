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

function GeoMap({ dataUrl, highlightCountry, initialCountry, hasGivenUp, bordersData }) {
  const [countriesData, setCountriesData] = useState(null);
  const [highlightedCountries, setHighlightedCountries] = useState([]);

  useEffect(() => {
    fetch(dataUrl)
      .then(res => res.json())
      .then(data => {
        setCountriesData(data);
      })
      .catch(err => console.error(err));
  }, [dataUrl]);

  useEffect(() => {
    if (highlightCountry) {
      setHighlightedCountries(prev => [...prev, highlightCountry]);
    }
  }, [highlightCountry]);

const getStyle = (feature) => {
  const featureNameLower = feature.properties.name.toLowerCase();
    if (hasGivenUp && initialCountry && bordersData[initialCountry.properties.name].includes(feature.properties.name)) {
       return { fillColor: 'blue', weight: 2, color: 'black', fillOpacity: 0.6 };
  }
  if (highlightedCountries.includes(featureNameLower)) {
    return { fillColor: 'blue', weight: 2, color: 'black', fillOpacity: 0.6 };
  } else if (initialCountry && featureNameLower === initialCountry.properties.name.toLowerCase()) {
    return { fillColor: 'pink', weight: 2, color: 'black', fillOpacity: 0.3 };
  }
  return { fillColor: 'transparent', weight: 1, color: 'black', fillOpacity: 1 };
};

  return (
    <MapContainer center={[51.505, -0.09]} zoom={2} style={{ height: '500px', width: '100%' }}>
      {countriesData && (
        <GeoJSON data={countriesData} style={getStyle} />
      )}
      {(initialCountry || highlightCountry) && (
        <MapEffect initialCountry={initialCountry} />
      )}
    </MapContainer>
  );
}

export default GeoMap;
