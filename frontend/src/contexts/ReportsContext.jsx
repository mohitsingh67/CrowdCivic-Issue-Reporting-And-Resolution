import { createContext, useContext, useState, useEffect } from 'react';
import { reportsAPI } from '../utils/api';

const ReportsContext = createContext(null);

export function ReportsProvider({ children }) {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    priority: 'all'
  });
  const [loading, setLoading] = useState(false);

  const fetchReports = async (customFilters = {}) => {
    try {
      setLoading(true);
      const params = { ...filters, ...customFilters };
      const response = await reportsAPI.getReports(params);
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const createReport = async (formData) => {
    try {
      const response = await reportsAPI.createReport(formData);
      setReports(prev => [response.data, ...prev]);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creating report:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to create report' };
    }
  };

  const updateReport = async (id, updates) => {
    try {
      const response = await reportsAPI.updateReport(id, updates);
      setReports(prev =>
        prev.map(report => report._id === id ? response.data : report)
      );
      return { success: true };
    } catch (error) {
      console.error('Error updating report:', error);
      return { success: false };
    }
  };

  const addComment = async (reportId, comment) => {
    try {
      const response = await reportsAPI.addComment(reportId, comment);
      setReports(prev =>
        prev.map(report => {
          if (report._id === reportId) {
            return { ...report, comments: [...report.comments, response.data] };
          }
          return report;
        })
      );
      return { success: true };
    } catch (error) {
      console.error('Error adding comment:', error);
      return { success: false };
    }
  };

  const toggleLike = async (reportId) => {
    try {
      const response = await reportsAPI.toggleLike(reportId);
      setReports(prev =>
        prev.map(report => {
          if (report._id === reportId) {
            return { ...report, likes: response.data.likes };
          }
          return report;
        })
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error toggling like:', error);
      return { success: false };
    }
  };

  const getFilteredReports = () => {
    return reports.filter(report => {
      const categoryMatch = filters.category === 'all' || report.category === filters.category;
      const statusMatch = filters.status === 'all' || report.status === filters.status;
      const priorityMatch = filters.priority === 'all' || report.priority === filters.priority;
      return categoryMatch && statusMatch && priorityMatch;
    });
  };

  return (
    <ReportsContext.Provider value={{
      reports,
      filters,
      setFilters,
      loading,
      createReport,
      updateReport,
      addComment,
      toggleLike,
      getFilteredReports,
      fetchReports
    }}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReports must be used within ReportsProvider');
  }
  return context;
}
