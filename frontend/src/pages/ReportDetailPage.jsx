import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reportsAPI } from '../utils/api';
import { Calendar, MapPin, AlertCircle, MessageCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function ReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const response = await reportsAPI.getReportById(id);
      setReport(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setSubmitting(true);
    try {
      await reportsAPI.addComment(id, { text: feedback, isFeedback: true });
      setFeedback('');
      fetchReport();
      alert('Thank you for your feedback!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Report not found</p>
      </div>
    );
  }

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

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{report.title}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[report.status]}`}>
            {report.status}
          </span>
        </div>

        <p className="text-gray-600 mb-6">{report.description}</p>

        {report.imageUrl && (
          <img
            src={report.imageUrl}
            alt="Report"
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-sm text-gray-500">Category</div>
              <div className="font-medium">{report.category}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-sm text-gray-500">Priority</div>
              <div className={`font-medium ${priorityColors[report.priority]}`}>
                {report.priority}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-sm text-gray-500">Location</div>
              <div className="font-medium">{report.location.address || 'Not specified'}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-sm text-gray-500">Reported</div>
              <div className="font-medium">{new Date(report.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {report.comments && report.comments.length > 0 && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Comments & Updates
            </h3>
            <div className="space-y-4">
              {report.comments.map((comment, index) => (
                <div key={index} className={`p-4 rounded-lg ${comment.isFeedback ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{comment.author}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                  {comment.isFeedback && (
                    <span className="inline-block mt-2 text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                      Feedback
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {report.status === 'Resolved' && report.reportedBy._id === user?._id && (
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">Provide Feedback</h3>
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="How was your experience? Was the issue resolved satisfactorily?"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={submitting || !feedback.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
