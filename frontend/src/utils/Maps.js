import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Fix default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const defaultCenter = [40.7128, -74.0060]; // Default to New York City

const LocationMarker = ({ onAddStation }) => {
  const [position, setPosition] = useState(null);
  const [chargingType, setChargingType] = useState('Type 1');
  const [capacity, setCapacity] = useState('1');
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/submit-station', {
        location: { lat: position.lat, lng: position.lng },
        type: chargingType,
        capacity: parseInt(capacity),
        approved: false  // Assuming new stations are not approved by default
      });
      alert('Charging station submitted successfully');
      onAddStation({...response.data, latlng: position}); // Pass new station data up to parent component
      setPosition(null);  // Clear position after submission
    } catch (error) {
      alert('Error submitting charging station: ' + error.message);
    }
  };

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Type of Charging Station:</label>
            <select value={chargingType} onChange={(e) => setChargingType(e.target.value)} required>
              <option value="Type 1">Type 1</option>
              <option value="Type 2">Type 2</option>
              <option value="Type 3">Type 3</option>
            </select>
          </div>
          <div>
            <label>Capacity:</label>
            <select value={capacity} onChange={(e) => setCapacity(e.target.value)} required>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <button type="submit">Submit Station</button>
        </form>
      </Popup>
    </Marker>
  );
};

const Maps = () => {
  const [center, setCenter] = useState(null);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCenter = [position.coords.latitude, position.coords.longitude];
        setCenter(userCenter);
        fetchStations(userCenter);
      },
      () => {
        console.log('Unable to retrieve your location');
        fetchStations(defaultCenter);
      }
    );
  }, []);

  const fetchStations = async (center) => {
    try {
      const response = await axios.get('http://localhost:5000/api/all-stations');
      setStations(response.data.map(station => ({
        ...station,
        latlng: [station.location.lat, station.location.lng]
      })));
    } catch (error) {
      console.error('Failed to fetch stations:', error);
    }
  };

  const addNewStationToMap = (newStation) => {
    setStations(currentStations => [...currentStations, newStation]);
  };

  const markerIcon = (isApproved) => new L.Icon({
    iconUrl: isApproved ? 'path_to_green_icon.png' : 'path_to_grey_icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  if (!center) {
    return <div>Loading map...</div>;
  }

  return (
    <MapContainer center={center} zoom={10} style={{ height: '100vh', width: '100vw' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {stations.map(station => (
        <Marker
          key={station._id}
          position={station.latlng}
          icon={markerIcon(station.approved)}
        >
          <Popup>
            Type: {station.type}<br />
            Capacity: {station.capacity}<br />
            Approved: {station.approved ? 'Yes' : 'No'}
          </Popup>
        </Marker>
      ))}
      <LocationMarker onAddStation={addNewStationToMap} />
    </MapContainer>
  );
}

export default Maps;
