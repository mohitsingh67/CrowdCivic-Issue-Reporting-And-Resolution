import { Filter } from 'lucide-react';
import { useReports } from '../../contexts/ReportsContext';

export default function MapFilters() {
  const { filters, setFilters, reports } = useReports();

  const categories = ['all', 'Road', 'Sanitation', 'Electricity', 'Water', 'Lighting', 'Parks', 'Other'];
  const statuses = ['all', 'Submitted', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
  const priorities = ['all', 'Low', 'Normal', 'High', 'Critical'];

  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-[1000] min-w-64">
      <div className="flex items-center space-x-2 mb-3">
        <Filter className="w-4 h-4 text-gray-500" />
        <span className="font-medium text-gray-700">Filters</span>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Statuses' : status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {priorities.map(priority => (
              <option key={priority} value={priority}>
                {priority === 'all' ? 'All Priorities' : priority}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setFilters({ category: 'all', status: 'all', priority: 'all' })}
          className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium py-1"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
