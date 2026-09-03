import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Gold Marker Icon
const goldIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const PropertiesMap = ({ properties }) => {
  // Center map on Jaipur roughly if no properties, or average of properties
  const defaultCenter = [26.9124, 75.7873];
  
  const mapCenter = properties.length > 0 && properties[0].latitude && properties[0].longitude
    ? [properties[0].latitude, properties[0].longitude]
    : defaultCenter;

  return (
    <div className="rounded-4 overflow-hidden shadow-lg border border-secondary border-opacity-50" style={{ height: '600px', width: '100%', position: 'relative', zIndex: 1 }}>
      <MapContainer center={mapCenter} zoom={11} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {properties.map((prop) => {
          if (!prop.latitude || !prop.longitude) return null;
          
          return (
            <Marker key={prop._id} position={[prop.latitude, prop.longitude]} icon={goldIcon}>
              <Popup className="property-popup">
                <div className="card border-0" style={{ width: '200px', margin: '-14px', borderRadius: '8px', overflow: 'hidden' }}>
                  <img src={prop.image || 'https://via.placeholder.com/200x120?text=No+Image'} className="card-img-top" alt={prop.title} style={{ height: '120px', objectFit: 'cover' }} />
                  <div className="card-body p-3 bg-dark text-light border-top border-warning border-opacity-25">
                    <h6 className="card-title fw-bold text-truncate mb-1" title={prop.title}>{prop.title}</h6>
                    <p className="card-text text-warning fw-bold mb-2">₹{prop.price?.toLocaleString()}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-secondary bg-opacity-25 text-light">{prop.type}</span>
                      <Link to={`/property/${prop._id}`} className="btn btn-sm btn-outline-warning py-0 px-3 rounded-pill fw-semibold" style={{ fontSize: '0.75rem' }}>View</Link>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default PropertiesMap;
