import { useState, useEffect } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { reportsAPI } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

export default function StaffPortal() {
  const { user } = useAuth();
  const [assignedReports, setAssignedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState({});

  useEffect(() => {
    fetchAssignedReports();
  }, []);

  const fetchAssignedReports = async () => {
    try {
      const response = await reportsAPI.getAssignedReports();
      setAssignedReports(response.data);
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

  const priorityColors = {
    Low: 'text-green-600',
    Normal: 'text-blue-600',
    High: 'text-orange-600',
    Critical: 'text-red-600'
  };

  const handleStatusChange = async (reportId, status) => {
    try {
      await reportsAPI.updateReport(reportId, { status });
      fetchAssignedReports();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleAddComment = async (reportId) => {
    const text = commentText[reportId]?.trim();
    if (text) {
      try {
        await reportsAPI.addComment(reportId, { text });
        setCommentText({ ...commentText, [reportId]: '' });
        fetchAssignedReports();
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const getDirectionsUrl = (lat, lng) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  if (assignedReports.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Assigned Tasks</h3>
        <p className="text-gray-600">You don't have any assigned reports at the moment.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <Clock className="w-5 h-5 text-orange-500" />
        <h2 className="text-lg font-semibold text-gray-900">My Assignments</h2>
        <span className="bg-orange-100 text-orange-800 text-sm font-medium px-2 py-1 rounded-full">
          {assignedReports.length}
        </span>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {assignedReports.map((report) => (
          <div key={report._id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{report.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>{report.category}</span>
                  <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                  <span className={priorityColors[report.priority]}>
                    {report.priority} Priority
                  </span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[report.status]}`}>
                {report.status}
              </span>
            </div>

            {report.imageUrl && (
              <img
                src={report.imageUrl}
                alt="Report"
                className="w-full h-32 object-cover rounded-md mb-3"
              />
            )}

            <div className="flex space-x-2 mb-3">
              <button
                onClick={() => handleStatusChange(report._id, 'In Progress')}
                className="flex-1 px-3 py-2 bg-orange-100 text-orange-700 text-sm font-medium rounded hover:bg-orange-200 transition-colors"
              >
                Start Work
              </button>
              <button
                onClick={() => handleStatusChange(report._id, 'Resolved')}
                className="flex-1 px-3 py-2 bg-green-100 text-green-700 text-sm font-medium rounded hover:bg-green-200 transition-colors"
              >
                Mark Resolved
              </button>
              <button
                onClick={() => window.open(getDirectionsUrl(report.location.lat, report.location.lng), '_blank')}
                className="px-3 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded hover:bg-blue-200 transition-colors"
              >
                Directions
              </button>
            </div>

            {report.comments && report.comments.length > 0 && (
              <div className="mb-3 pt-3 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Comments:</h4>
                <div className="space-y-2 max-h-24 overflow-y-auto">
                  {report.comments.map((comment, idx) => (
                    <div key={idx} className="text-sm">
                      <span className="font-medium text-gray-900">{comment.author}:</span>
                      <span className="ml-2 text-gray-600">{comment.text}</span>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(comment.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Add a progress update..."
                value={commentText[report._id] || ''}
                onChange={(e) => setCommentText({ ...commentText, [report._id]: e.target.value })}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => handleAddComment(report._id)}
                className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
              >
                Add Note
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
