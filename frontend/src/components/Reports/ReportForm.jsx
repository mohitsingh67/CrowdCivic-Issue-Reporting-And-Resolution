import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Send, AlertTriangle } from 'lucide-react';
import { useReports } from '../../contexts/ReportsContext';
import { useAuth } from '../../contexts/AuthContext';

export default function ReportForm() {
  const { createReport } = useReports();
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Road',
    priority: 'Normal',
    address: ''
  });

  const [location, setLocation] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsGettingLocation(false);
        setError('');
      },
      (err) => {
        setError('Unable to get location. Please enter address manually.');
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (!location && !formData.address.trim()) {
      setError('Please either share your location or provide an address.');
      setLoading(false);
      return;
    }

    const reportLocation = location || { lat: 26.2183, lng: 78.1828 };

    const data = new FormData();
    data.append('title', formData.title.trim());
    data.append('description', formData.description.trim());
    data.append('category', formData.category);
    data.append('priority', formData.priority);
    data.append('lat', reportLocation.lat);
    data.append('lng', reportLocation.lng);
    data.append('address', formData.address.trim());
    if (imageFile) {
      data.append('image', imageFile);
    }

    const result = await createReport(data);

    if (result.success) {
      alert('Report submitted successfully!');
      navigate('/my-reports');
    } else {
      setError(result.message || 'Failed to submit report');
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <AlertTriangle className="w-5 h-5 text-orange-500" />
        <h2 className="text-lg font-semibold text-gray-900">Report an Issue</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Issue Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Brief description of the issue"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            required
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Provide detailed information about the issue"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Road">Road</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Electricity">Electricity</option>
              <option value="Water">Water</option>
              <option value="Lighting">Lighting</option>
              <option value="Parks">Parks</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photo (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-md" />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="text-center">
                <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Take or upload a photo
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <div className="space-y-2">
            <button
              type="button"
              onClick={getLocation}
              disabled={isGettingLocation}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 text-sm w-full"
            >
              <MapPin className="w-4 h-4" />
              <span>
                {isGettingLocation ? 'Getting location...' : location ? 'Location captured' : 'Use current location'}
              </span>
            </button>

            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Or enter address manually"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />

            {location && (
              <p className="text-xs text-gray-500">
                Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>{loading ? 'Submitting...' : 'Submit Report'}</span>
        </button>
      </form>
    </div>
  );
}
