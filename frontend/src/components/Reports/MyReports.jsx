import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, MessageCircle } from 'lucide-react';
import { reportsAPI } from '../../utils/api';

export default function MyReports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyReports();
  }, []);

  const fetchMyReports = async () => {
    try {
      const response = await reportsAPI.getMyReports();
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    Submitted: 'bg-blue-100 text-blue-800',
    Assigned: 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-orange-100 text-orange-800',
    Resolved: 'bg-green-100 text-green-800',
    Closed: 'bg-gray-100 text-gray-800'
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <MessageCircle className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reports Yet</h3>
        <p className="text-gray-600">You haven't submitted any reports yet. Click "Report Issue" to get started.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <MessageCircle className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold text-gray-900">My Reports</h2>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full">
          {reports.length}
        </span>
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report._id}
            onClick={() => navigate(`/report/${report._id}`)}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-900 leading-tight">{report.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[report.status]}`}>
                {report.status}
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {report.description}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{report.category}</span>
                </div>

                {report.comments && report.comments.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>{report.comments.length} comment{report.comments.length !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>

              <span className={`font-medium ${
                report.priority === 'Critical' ? 'text-red-600' :
                report.priority === 'High' ? 'text-orange-600' :
                report.priority === 'Normal' ? 'text-blue-600' : 'text-green-600'
              }`}>
                {report.priority}
              </span>
            </div>

            {report.imageUrl && (
              <div className="mt-3">
                <img
                  src={report.imageUrl}
                  alt="Report"
                  className="w-full h-32 object-cover rounded-md"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
