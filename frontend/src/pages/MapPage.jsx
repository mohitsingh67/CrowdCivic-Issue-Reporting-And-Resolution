import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useReports } from '../contexts/ReportsContext';
import MapFilters from '../components/Map/MapFilters';
import ReportPopup from '../components/Map/ReportPopup';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createCustomIcon = (priority) => {
  const colors = {
    Low: '#10B981',
    Normal: '#3B82F6',
    High: '#F59E0B',
    Critical: '#EF4444'
  };

  return L.divIcon({
    html: `<div style="background-color: ${colors[priority]}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

function MapController({ center }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);

  return null;
}

export default function MapPage() {
  const { getFilteredReports } = useReports();
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([26.2183, 78.1828]);
  const filteredReports = getFilteredReports();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = [position.coords.latitude, position.coords.longitude];
          setUserLocation(location);
          setMapCenter(location);
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  }, []);

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="h-full relative">
        <MapFilters />
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          className="z-0 rounded-lg"
        >
          <MapController center={mapCenter} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {userLocation && (
            <Marker position={userLocation}>
              <Popup>Your current location</Popup>
            </Marker>
          )}

          {filteredReports.map((report) => (
            <Marker
              key={report._id}
              position={[report.location.lat, report.location.lng]}
              icon={createCustomIcon(report.priority)}
            >
              <ReportPopup report={report} />
            </Marker>
          ))}
        </MapContainer>

        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg z-[1000]">
          <h4 className="text-sm font-semibold mb-2">Priority Levels</h4>
          <div className="space-y-1">
            {['Low', 'Normal', 'High', 'Critical'].map((priority) => {
              const colors = {
                Low: '#10B981',
                Normal: '#3B82F6',
                High: '#F59E0B',
                Critical: '#EF4444'
              };
              return (
                <div key={priority} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: colors[priority] }}
                  />
                  <span className="text-xs">{priority}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
