import { useState } from 'react';
import { Settings, Users } from 'lucide-react';
import { useReports } from '../../contexts/ReportsContext';
import ReportsList from './ReportsList';
import StaffManagement from './StaffManagement';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('reports');
  const { reports } = useReports();

  const stats = {
    total: reports.length,
    open: reports.filter(r => r.status !== 'Resolved' && r.status !== 'Closed').length,
    resolved: reports.filter(r => r.status === 'Resolved').length,
    critical: reports.filter(r => r.priority === 'Critical').length
  };

  const tabs = [
    { id: 'reports', label: 'Reports', icon: Settings },
    { id: 'staff', label: 'Staff', icon: Users }
  ];

  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold text-gray-900">Admin Dashboard</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-xs text-blue-800">Total Reports</div>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{stats.open}</div>
          <div className="text-xs text-orange-800">Open Issues</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          <div className="text-xs text-green-800">Resolved</div>
        </div>
        <div className="bg-red-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
          <div className="text-xs text-red-800">Critical</div>
        </div>
      </div>

      <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors flex-1 justify-center ${
              activeTab === id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'reports' && <ReportsList />}
      {activeTab === 'staff' && <StaffManagement />}
    </div>
  );
}
