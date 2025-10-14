import { Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, AlertCircle } from 'lucide-react';

export default function ReportPopup({ report }) {
  const navigate = useNavigate();

  const statusColors = {
    Submitted: 'bg-blue-100 text-blue-800',
    Assigned: 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-orange-100 text-orange-800',
    Resolved: 'bg-green-100 text-green-800',
    Closed: 'bg-gray-100 text-gray-800'
  };

  const priorityColors = {
    Low: 'text-green-600',
    Normal: 'text-blue-600',
    High: 'text-yellow-600',
    Critical: 'text-red-600'
  };

  return (
    <Popup maxWidth={300} className="report-popup">
      <div className="p-2">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 leading-tight">{report.title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[report.status]}`}>
            {report.status}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {report.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <AlertCircle className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Category:</span>
            <span className="font-medium">{report.category}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <AlertCircle className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Priority:</span>
            <span className={`font-medium ${priorityColors[report.priority]}`}>
              {report.priority}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{report.location.address || 'Location not specified'}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">
              {new Date(report.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {report.imageUrl && (
          <div className="mt-3">
            <img
              src={report.imageUrl}
              alt="Report"
              className="w-full h-24 object-cover rounded-md"
            />
          </div>
        )}

        <button
          onClick={() => navigate(`/report/${report._id}`)}
          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors"
        >
          View Details
        </button>
      </div>
    </Popup>
  );
}
