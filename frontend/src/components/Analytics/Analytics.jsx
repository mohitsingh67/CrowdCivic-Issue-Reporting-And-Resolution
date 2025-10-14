import { BarChart3, TrendingUp, Clock, Users } from 'lucide-react';
import { useReports } from '../../contexts/ReportsContext';

export default function Analytics() {
  const { reports } = useReports();

  const totalReports = reports.length;
  const resolvedReports = reports.filter(r => r.status === 'Resolved').length;
  const avgResolutionTime = '2.3 days';
  const activeStaff = 4;

  const categoryStats = reports.reduce((acc, report) => {
    acc[report.category] = (acc[report.category] || 0) + 1;
    return acc;
  }, {});

  const statusStats = reports.reduce((acc, report) => {
    acc[report.status] = (acc[report.status] || 0) + 1;
    return acc;
  }, {});

  const recentReports = reports
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Total Reports</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{totalReports}</div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">Resolved</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{resolvedReports}</div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">Avg Resolution</span>
          </div>
          <div className="text-2xl font-bold text-orange-600">{avgResolutionTime}</div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Active Staff</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">{activeStaff}</div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Reports by Category</h3>
        <div className="space-y-2">
          {Object.entries(categoryStats).map(([category, count]) => {
            const percentage = (count / totalReports) * 100;
            return (
              <div key={category} className="flex items-center space-x-3">
                <div className="w-20 text-sm text-gray-600">{category}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-8 text-sm font-medium text-gray-900">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Status Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          {Object.entries(statusStats).map(([status, count]) => {
            const colors = {
              'Submitted': 'bg-blue-100 text-blue-800',
              'Assigned': 'bg-yellow-100 text-yellow-800',
              'In Progress': 'bg-orange-100 text-orange-800',
              'Resolved': 'bg-green-100 text-green-800',
              'Closed': 'bg-gray-100 text-gray-800'
            };
            return (
              <div key={status} className={`p-2 rounded ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
                <div className="font-medium">{count}</div>
                <div>{status}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Reports</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {recentReports.map((report) => (
            <div key={report._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{report.title}</div>
                <div className="text-xs text-gray-600">{report.category} • {report.priority}</div>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(report.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
