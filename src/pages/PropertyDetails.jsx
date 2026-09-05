import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PropertyChat from '../components/PropertyChat';
import axios from 'axios';

import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { getImageUrl } from '../utils/imageUrl';

// Custom icons for Neighborhood Radar
const createIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const redIcon = createIcon('red'); // Gyms
const blueIcon = createIcon('blue'); // Metro/Bus
const greenIcon = createIcon('green'); // Schools/Hospitals
const goldIcon = createIcon('gold'); // Property

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (property?.panoramaImage && window.pannellum) {
      const containerId = `panorama-${property._id}`;
      const container = document.getElementById(containerId);
      if (container) container.innerHTML = '';
      
      window.pannellum.viewer(containerId, {
        type: 'equirectangular',
        panorama: getImageUrl(property.panoramaImage),
        autoLoad: true,
        pitch: 10,
        yaw: 180,
        hfov: 110,
        showZoomCtrl: true,
        mouseZoom: true
      });
    }
  }, [property]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`/api/properties/${id}`);
        setProperty(res.data);
      } catch (err) {
        console.error("Error fetching property:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 mt-5 text-center min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-warning" role="status"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container py-5 mt-5 text-center min-vh-100">
        <h2>Property Not Found</h2>
        <Link to="/buy" className="btn btn-warning mt-3">Back to Listings</Link>
      </div>
    );
  }

  // Fallback map center if coordinates are missing (Jaipur)
  const lat = property.latitude || 26.9124;
  const lng = property.longitude || 75.7873;
  
  // Simulated Neighborhood Data
  const walkabilityScore = ((lat + lng) % 4 + 6).toFixed(1); // Mock score between 6.0 and 9.9
  const nearbyPlaces = [
    { type: 'Metro Station', icon: blueIcon, lat: lat + 0.005, lng: lng + 0.005 },
    { type: 'High School', icon: greenIcon, lat: lat - 0.004, lng: lng + 0.003 },
    { type: 'City Hospital', icon: greenIcon, lat: lat + 0.003, lng: lng - 0.004 },
    { type: 'Premium Gym', icon: redIcon, lat: lat - 0.002, lng: lng - 0.003 },
  ];

  return (
    <div className="min-vh-100 bg-light" style={{ paddingTop: '80px' }}>
      {/* Hero Section */}
      <div className="bg-dark text-light py-5 border-bottom border-warning border-3">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold fs-6">{property.type}</span>
                {property.isVerified && (
                  <span className="badge bg-success text-dark px-3 py-2 rounded-pill fw-bold fs-6"><i className="bi bi-shield-check me-1"></i>Verified by Nitin Real Estate</span>
                )}
              </div>
              <h1 className="display-4 fw-bold mb-2">{property.title}</h1>
              <p className="fs-5 text-secondary mb-4"><i className="bi bi-geo-alt-fill text-warning me-2"></i>{property.location}</p>
              <h2 className="text-warning fw-bold mb-0">₹{property.price?.toLocaleString()}</h2>
            </div>
            <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
              <button className="btn btn-lg btn-warning rounded-pill px-5 fw-bold shadow-sm mb-3 w-100 w-lg-auto">
                <i className="bi bi-whatsapp me-2"></i> Inquire Now
              </button>
              <button className="btn btn-lg btn-outline-light rounded-pill px-5 fw-bold w-100 w-lg-auto">
                <i className="bi bi-calendar2-check me-2"></i> Schedule Visit
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-5">
          {/* Left Column: 360 Tour & Description */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-5">
              <div className="card-header bg-white py-3 border-0">
                <h4 className="fw-bold mb-0"><i className="bi bi-eye text-warning me-2"></i> 360° Virtual Walkthrough</h4>
              </div>
              <div className="card-body p-0 bg-dark" style={{ height: '500px' }}>
                {property.panoramaImage ? (
                  <div id={`panorama-${property._id}`} style={{ width: '100%', height: '100%' }}></div>
                ) : (
                  <div className="h-100 w-100 position-relative">
                    <img src={property.image ? getImageUrl(property.image) : "https://via.placeholder.com/800x500?text=No+360+View"} alt={property.title} className="w-100 h-100 object-fit-cover opacity-50" />
                    <div className="position-absolute top-50 start-50 translate-middle text-center">
                      <i className="bi bi-camera-video-off fs-1 text-secondary mb-2"></i>
                      <h5 className="text-light">360° Tour Not Available</h5>
                      <p className="text-secondary small">Showing standard property image</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 mb-5">
              <div className="card-body p-4 p-md-5">
                <h4 className="fw-bold mb-4">About this Property</h4>
                <p className="lead text-muted" style={{ lineHeight: '1.8' }}>{property.description}</p>
                <div className="mt-4 p-4 bg-light rounded-3 border">
                  <h6 className="fw-bold mb-3">Contact Seller</h6>
                  {(!user || user.role === 'Buyer') ? (
                    <>
                      <p className="mb-3 fs-5 text-muted"><i className="bi bi-telephone-fill text-warning me-2"></i> +91 ••••• ••••• <span className="badge bg-secondary ms-2" style={{ fontSize: '0.5em' }}>Protected</span></p>
                      <p className="small text-muted mb-3">Connect securely with the owner to protect yourself from fraud.</p>
                      {user ? (
                        <button onClick={() => setChatOpen(true)} className="btn btn-warning px-4 py-2 rounded-pill fw-bold w-100">
                          <i className="bi bi-chat-dots-fill me-2"></i>Start Secure Chat
                        </button>
                      ) : (
                        <Link to="/login" className="btn btn-outline-warning px-4 py-2 rounded-pill fw-bold w-100">
                          <i className="bi bi-box-arrow-in-right me-2"></i>Login to Chat
                        </Link>
                      )}
                    </>
                  ) : (
                    <p className="mb-3 fs-5"><i className="bi bi-telephone-fill text-warning me-2"></i> {property.contactInfo}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Neighborhood Radar */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden sticky-top" style={{ top: '100px', zIndex: 1 }}>
              <div className="card-header bg-dark text-light py-3 border-0 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0"><i className="bi bi-radar text-warning me-2"></i> Neighborhood Radar</h5>
                <span className="badge bg-warning text-dark fs-6 rounded-pill">{walkabilityScore}/10</span>
              </div>
              <div className="p-3 bg-white text-center border-bottom">
                <span className="small text-muted fw-semibold text-uppercase">Walkability Score</span>
              </div>
              <div style={{ height: '350px' }}>
                <MapContainer center={[lat, lng]} zoom={14} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  />
                  {/* Property Center */}
                  <Marker position={[lat, lng]} icon={goldIcon}>
                    <Popup><b>{property.title}</b></Popup>
                  </Marker>
                  <Circle center={[lat, lng]} radius={800} pathOptions={{ color: 'var(--bs-warning)', fillColor: 'var(--bs-warning)', fillOpacity: 0.1 }} />
                  
                  {/* Nearby Essentials */}
                  {nearbyPlaces.map((place, idx) => (
                    <Marker key={idx} position={[place.lat, place.lng]} icon={place.icon}>
                      <Popup>{place.type}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
              <div className="card-body bg-white p-4">
                <h6 className="fw-bold mb-3">Nearby Essentials (1km radius)</h6>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                  <li><i className="bi bi-train-front-fill text-primary me-2"></i> Metro / Transport (1)</li>
                  <li><i className="bi bi-mortarboard-fill text-success me-2"></i> Schools & Education (2)</li>
                  <li><i className="bi bi-heart-pulse-fill text-danger me-2"></i> Health & Fitness (1)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Real-time chat modal */}
      {chatOpen && <PropertyChat property={property} onClose={() => setChatOpen(false)} />}
    </div>
  );
};

export default PropertyDetails;
